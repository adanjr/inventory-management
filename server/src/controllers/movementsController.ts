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
      createdById,
      details, 
    } = req.body;

    const movementDateObj = new Date(movementDate);

    console.log(req.body);

    const result = await prisma.$transaction(async (prisma) => {

      // Crear el movimiento original
      const movement = await prisma.movements.create({
        data: {
          fromLocation: fromLocationId ? {
            connect: { locationId: fromLocationId }
          } :  {},
          toLocation: toLocationId ? {
            connect: { locationId: toLocationId }
          } :  {},
          quantity,
          movementType,
          movementDate: movementDateObj,
          status,
          notes,
          approved,
          orderReference,       
          createdBy: { connect: { userId: Number(createdById) } },
        },
      });

      // Crear los detalles del movimiento original
      await prisma.movementDetail.createMany({
        data: details.map((detail: any) => ({
          movementId: movement.movementId,
          ...(detail.vehicleId ? { vehicleId: detail.vehicleId } : {}),
          ...(detail.productId ? { productId: detail.productId } : {}),
          inspectionStatus: detail.inspectionStatus,
          quantity: detail.quantity,
        })),
      });

      const shouldUpdateVehicles = 
        movementType === 'TRANSFERENCIA' &&
        status === 'EN TRANSITO' &&
        details.some((detail: any) => detail.vehicleId !== null);

        if (shouldUpdateVehicles) {
          const inTransitStatus = await prisma.vehicleAvailabilityStatus.findFirst({
            where: {
              name: status,
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
        }

        const shouldInsertProducts = 
        movementType === 'ENTRADA' &&
        status === 'COMPLETADO' &&
        details.some((detail: any) => detail.productId !== null);

        if (shouldInsertProducts) {
          for (const detail of details) {
            if (detail.productId !== null) {
              const existingInventoryLocation = await prisma.inventoryLocations.findFirst({
                where: {
                  productId: detail.productId,
                  locationId: toLocationId, // Buscar el producto en la ubicación `toLocationId`
                },
              });
        
              if (existingInventoryLocation) {
                // Si existe, sumarle la cantidad al `quantity_in_stock`
                await prisma.inventoryLocations.update({
                  where: {
                    inventoryLocationId: existingInventoryLocation.inventoryLocationId,
                  },
                  data: {
                    quantity_in_stock: (existingInventoryLocation.quantity_in_stock || 0) + detail.quantity,
                  },
                });
              } else {
                // Si no existe, crear un nuevo registro con `quantity_in_stock` igual a `detail.quantity`
                await prisma.inventoryLocations.create({
                  data: {
                    productId: detail.productId,
                    locationId: toLocationId,
                    quantity_in_stock: detail.quantity,
                  },
                });
              }

              await prisma.products.update({
                where: {
                  productId: detail.productId,
                },
                data: {
                  stockQuantity: + detail.quantity,
                },
              });

            }
          }
        }

        const shouldDeleteProducts = 
        movementType === 'SALIDA' &&
        status === 'COMPLETADO' &&
        details.some((detail: any) => detail.productId !== null);

        if (shouldDeleteProducts) {
          for (const detail of details) {
            if (detail.productId !== null) {
              // Buscar el inventario existente en `fromLocationId`
              const existingInventoryLocation = await prisma.inventoryLocations.findFirst({
                where: {
                  productId: detail.productId,
                  locationId: fromLocationId, // Buscar el producto en la ubicación `fromLocationId`
                },
              });
        
              if (!existingInventoryLocation) {
                // Lanzar un error si no existe el producto en la ubicación de origen
                throw new Error(`No existe inventario para el producto ${detail.productId} en la ubicación de origen ${fromLocationId}`);
              }
        
              if ((existingInventoryLocation.quantity_in_stock ?? 0) < detail.quantity) {
                // Lanzar un error si la cantidad en stock es insuficiente
                throw new Error(
                  `Inventario insuficiente para el producto ${detail.productId} en la ubicación de origen ${fromLocationId}. ` +
                  `Cantidad en stock: ${existingInventoryLocation.quantity_in_stock}, Cantidad requerida: ${detail.quantity}`
                );
              }
        
              // Actualizar el inventario restando la cantidad
              await prisma.inventoryLocations.update({
                where: {
                  inventoryLocationId: existingInventoryLocation.inventoryLocationId,
                },
                data: {
                  quantity_in_stock: (existingInventoryLocation.quantity_in_stock ?? 0) - detail.quantity,
                },
              });

              await prisma.products.update({
                where: {
                  productId: detail.productId,
                },
                data: {
                  stockQuantity: - detail.quantity,
                },
              });
            }
          }
        } 

    return movement;
  });

    res.status(201).json(result);
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
        toLocation: true, 
        createdBy: true,  
        receivedBy: true,     // Incluye la ubicación de destino
        MovementDetail: {      // Incluye los detalles del movimiento
          include: {
            product: true,    // Incluye productos relacionados en el detalle
            vehicle: {        // Incluye solo los campos necesarios de vehículos
              select: {
                vehicleId: true,
                internal_serial: true,
                engineNumber: true,
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
        fromLocationName: movement.fromLocation?.name || null,  
        toLocationName: movement.toLocation?.name || null,  
        createdByName: movement.createdBy?.name || null,  
        receivedByName: movement.receivedBy?.name || null,     
        vehicles: movement.MovementDetail.map(detail => ({
          vehicleId: detail.vehicle?.vehicleId,
          internal_serial: detail.vehicle?.internal_serial,
          engineNumber: detail.vehicle?.engineNumber,
          modelName: detail.vehicle?.model?.name,
          colorName: detail.vehicle?.color?.name,
        })),
        products: movement.MovementDetail.map(detail => ({
          productId: detail.product?.productId,
          name: detail.product?.name,
          productCode: detail.product?.productCode,
          quantity: detail.quantity,         
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

    await prisma.$transaction(async (prisma) => {
      // Actualizar el movimiento
      const movement = await prisma.movements.update({
        where: { movementId: Number(id) },
        data: {
          arrivalDate,
          receivedBy: { connect: { userId: Number(receivedBy) } },
          isReceived,
          receptionNotes,
          status: "COMPLETADO"
        },
      });

      const movementUpdated = await prisma.movements.findFirst({
        where: {
          movementId: Number(id),
        },
      });

      const movementDetails = await prisma.movementDetail.findMany({
        where: {
          movementId: Number(id),
        },
      });

      const inTransitStatus = await prisma.vehicleAvailabilityStatus.findFirst({
        where: {
          name: 'DISPONIBLE',
        },
      });

      if (!inTransitStatus) {
        throw new Error('No se encontró el estado de "DISPONIBLE"');
      }

      // Actualizar la ubicación y el estado de disponibilidad de los vehículos relacionados
      await prisma.vehicles.updateMany({
        where: {
          vehicleId: {
            in: movementDetails.map((detail: any) => detail.vehicleId),
          },
        },
        data: {
          locationId: movementUpdated?.toLocationId,
          availabilityStatusId: inTransitStatus.statusId,
        },
      });

      res.json(movement); // Enviar respuesta solo si la transacción fue exitosa
    });
  } catch (error) {
    console.error("Error updating movement:", error);
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
