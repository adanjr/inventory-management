import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los vehículos o buscar por VIN, stockNumber o descripción
export const getVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const vehicles = await prisma.vehicles.findMany({
      where: {
        OR: [
          { vin: { contains: search } },
          { stockNumber: { contains: search } },
          { description: { contains: search } },
        ],
      },
      include: {
        model: {
          include: {
            make: true, // Incluir la relación con Make
            family: true,
          },
        },
        color: true,
        condition: true,
        availabilityStatus: true,
        status: true,
        location: true,
        warranty: true,
        batteryWarranty : true,
      },
    });

    const vehiclesWithDetails = vehicles.map(vehicle => ({
      ...vehicle,
      modelName: vehicle.model?.name || 'N/A',
      makeName: vehicle.model?.make?.name || 'N/A', // Obtener el nombre del fabricante
      familyName: vehicle.model?.family?.name || 'N/A',
      colorName: vehicle.color?.name || 'N/A',
      condition: vehicle.condition?.name || 'N/A',
      availabilityStatus: vehicle.availabilityStatus?.name || 'N/A',
      statusName: vehicle.status?.name || 'N/A',
      locationName: vehicle.location?.name || 'N/A',
      warrantyInfo: vehicle.warranty?.description || 'N/A',
      batteryWarrantyInfo: vehicle.batteryWarranty?.description || 'N/A',
    }));

    res.json(vehiclesWithDetails);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vehicles" });
  }
};

// Crear un nuevo vehículo
export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      vin,
      internal_serial,
      modelId,
      year,
      colorId,
      mileage,
      price,
      conditionId,
      availabilityStatusId,
      statusId,
      locationId,
      stockNumber,
      barcode,
      qrCode,
      description,
      warrantyId,
      batteryWarrantyId,
    } = req.body;    

    const vehicle = await prisma.vehicles.create({
      data: {
        vin,
        internal_serial,
        modelId,
        year,
        colorId,
        mileage,
        price,
        conditionId,
        availabilityStatusId,
        statusId,
        locationId,
        stockNumber,
        barcode,
        qrCode,
        description,
        warrantyId,
        batteryWarrantyId,
      },
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Error creating vehicle: " + error });
  }
};

// Obtener un vehículo por ID
export const getVehicleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const vehicle = await prisma.vehicles.findUnique({
      where: { vehicleId: Number(id) },
      include: {
        model: {
          include: {
            make: true, // Asegúrate de incluir la relación de make
            family: true, // Asegúrate de incluir la relación de family
          },
        },
        color: true,
        condition: true,
        availabilityStatus: true,
        status: true,
        location: true,
        warranty: true,
        batteryWarranty: true,
      },
    });

    if (!vehicle) {
      res.status(404).json({ message: "Vehicle not found" });
    } else {
      // Extraer makeId y familyId
      const makeId = vehicle.model?.make?.makeId || null; // Puede ser null si no existe
      const familyId = vehicle.model?.family?.familyId || null; // Puede ser null si no existe

      // Devolver el vehículo junto con makeId y familyId
      res.json({
        ...vehicle,
        makeId,
        familyId,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vehicle" });
  }
};

// Actualizar un vehículo por ID
export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      vin,
      internal_serial,
      modelId,
      makeId,
      familyId,
      year,
      colorId,
      mileage,
      price,
      conditionId,
      availabilityStatusId,
      statusId,
      locationId,
      stockNumber,
      barcode,
      qrCode,
      description,
      warrantyId,
      batteryWarrantyId,
    } = req.body;

    console.log(req.body);

    const vehicle = await prisma.vehicles.update({
      where: { vehicleId: Number(id) },
      data: {
        vin,
        internal_serial,
        modelId,
        year,
        colorId,
        mileage,
        price,
        conditionId,
        availabilityStatusId,
        statusId,
        locationId,
        stockNumber,
        barcode,
        qrCode,
        description,
        warrantyId,
        batteryWarrantyId,
      },
    });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Error updating vehicle" });
  }
};

// Eliminar un vehículo por ID
export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.vehicles.delete({
      where: { vehicleId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting vehicle" });
  }
};
