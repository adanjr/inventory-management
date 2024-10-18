import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los movimientos
// Obtener todos los movimientos
export const getMovements = async (req: Request, res: Response): Promise<void> => {
  try {
    const movements = await prisma.movements.findMany({
      include: {
        fromLocation: true, // Incluye la ubicación de origen
        toLocation: true,   // Incluye la ubicación de destino
        MovementDetail: {   // Incluye los detalles del movimiento
          include: {
            product: true,  // Incluye productos relacionados en el detalle
            //vehicle: true,  // Incluye vehículos relacionados en el detalle
          },
        },
      },
    });

    // Transforma los resultados para incluir solo el 'name' de las ubicaciones si tienen valor
    const transformedMovements = movements.map(movement => ({
      ...movement,
      fromLocationName: movement.fromLocation?.name || null,  
      toLocationName: movement.toLocation?.name || null, 
    }));     

    res.json(transformedMovements);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving movements" });
  }
};


 // Crear un nuevo movimiento
export const createMovement = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fromLocationId,
      toLocationId,
      quantity,
      movementType,
      movementDate,
      status,
      notes,
      approved,
      orderReference,
      details, // Array de detalles del movimiento
    } = req.body;

    const movementDateObj = new Date(movementDate);

    // Crear el movimiento original
    const movement = await prisma.movements.create({
      data: {
        fromLocationId,
        toLocationId,
        quantity,
        movementType,
        movementDate: movementDateObj,
        status,
        notes,
        approved,
        orderReference,
      },
    });

    // Crear los detalles del movimiento original
    await prisma.movementDetail.createMany({
      data: details.map((detail: any) => ({
        movementId: movement.movementId,
        vehicleId: detail.vehicleId,
        productId: detail.productId,
        inspectionStatus: detail.inspectionStatus,
      })),
    });

    const inTransitStatus = await prisma.vehicleAvailabilityStatus.findFirst({
      where: {
        name: 'EN TRANSITO',
      },
    });

    if (!inTransitStatus) {
      throw new Error('No se encontró el estado de "EN TRANSITO"');
    }

    // Actualizar la ubicación y el availabilityStatusId de los vehículos
    await prisma.vehicles.updateMany({
      where: {
        vehicleId: {
          in: details.map((detail: any) => detail.vehicleId), // Los IDs de los vehículos a actualizar
        },
      },
      data: {
        locationId: null, // O null si prefieres
        availabilityStatusId: inTransitStatus.statusId, // Asigna el ID de "EN TRANSITO"
      },
    });

    res.status(201).json(movement);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating movement:", error); // Imprime el error completo
      res.status(500).json({ message: "Error creating movement: " + error.message });
    } else {
      res.status(500).json({ message: "Unknown error" });
    }
  }
};


// Obtener un movimiento por ID
export const getMovementById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const movement = await prisma.movements.findUnique({
      where: { movementId: Number(id) },
      include: {
        fromLocation: true,    // Incluye la ubicación de origen
        toLocation: true,      // Incluye la ubicación de destino
        MovementDetail: {      // Incluye los detalles del movimiento
          include: {
            product: true,    // Incluye productos relacionados en el detalle
            vehicle: {        // Incluye solo los campos necesarios de vehículos
              select: {
                vehicleId: true,
                internal_serial: true,
                model: {
                  select: { name: true }, // Solo el nombre del modelo
                },
                color: {
                  select: { name: true }, // Solo el nombre del color
                },
              },
            },
          },
        },
      },
    });

    if (!movement) {
      res.status(404).json({ message: "Movement not found" });
    } else {
      // Transforma el movimiento para incluir los nombres de las ubicaciones
      const transformedMovement = {
        ...movement,
        fromLocationName: movement.fromLocation?.name || null,  // Transforma la ubicación de origen en su nombre
        toLocationName: movement.toLocation?.name || null,      // Transforma la ubicación de destino en su nombre
        vehicles: movement.MovementDetail.map(detail => ({
          vehicleId: detail.vehicle?.vehicleId,
          internal_serial: detail.vehicle?.internal_serial,
          modelName: detail.vehicle?.model?.name,
          colorName: detail.vehicle?.color?.name,
        })),
      };

      res.json(transformedMovement);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving movement" });
  }
};

// Actualizar un movimiento por ID
export const updateMovement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      arrivalDate,    
      receivedBy,     
      isReceived,     
      receptionNotes, 
    } = req.body;

    // Actualizar el movimiento
    const movement = await prisma.movements.update({
      where: { movementId: Number(id) },
      data: {
        arrivalDate,     
        receivedBy,      
        isReceived,      
        receptionNotes,
        status: "COMPLETADO"
      },
    });

    const movementUpdated = await prisma.movements.findFirst({
        where: {
          movementId: Number(id), // Convertir a número
        },
      });

      const movementDetails = await prisma.movementDetail.findMany({
        where: {
          movementId: Number(id), // Convertir a número
        },
      });  

      const inTransitStatus = await prisma.vehicleAvailabilityStatus.findFirst({
        where: {
          name: 'DISPONIBLE',
        },
      });

      if (!inTransitStatus) {
        throw new Error('No se encontró el estado de "EN TRANSITO"');
      }
  
    await prisma.vehicles.updateMany({
      where: {
        vehicleId: {
          in: movementDetails.map((detail: any) => detail.vehicleId), // Los IDs de los vehículos a actualizar
        },
      },
      data: {
        locationId: movementUpdated?.toLocationId, // Asignar Ubicacion Destino
        availabilityStatusId: inTransitStatus.statusId, // Lo pone en DISPONIBLE
      },
    });

    res.json(movement);
  } catch (error) {
    res.status(500).json({ message: "Error updating movement" });
  }
};


// Eliminar un movimiento por ID
export const deleteMovement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.movements.delete({
      where: { movementId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting movement" });
  }
};
