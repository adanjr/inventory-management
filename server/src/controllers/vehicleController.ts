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
        make: true,       // Asegúrate de que el make esté siempre incluido
        model: true,      // Asegúrate de que el model esté siempre incluido
        color: true,
        engineType: true,
        fuelType: true,
        transmission: true,
        status: true,
        vehicleType: true,
      },
    });

    const vehiclesWithMakeName = vehicles.map(vehicle => ({
      ...vehicle,
      makeName: vehicle.make?.name || 'N/A',  // Crear makeName a partir del campo make
      modelName: vehicle.model?.name || 'N/A', // Crear modelName a partir del campo model
      // Puedes hacer lo mismo para otros campos si es necesario
    }));
    
    res.json(vehiclesWithMakeName);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vehicles" });
  }
};

// Crear un nuevo vehículo
export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  try {  
    console.log("Datos recibidos en el POST:", req.body);
    const {
      vin,
      internal_serial,
      vehicleTypeId,
      makeId,
      modelId,
      year,
      colorId,
      engineTypeId,
      fuelTypeId,
      transmissionId,       
      mileage,
      batteryCapacity,
      range,
      wheelCount,
      price,
      statusId,
      stockNumber,
      barcode,
      qrCode,
      description,     
    } = req.body;

    const vehicle = await prisma.vehicles.create({
      data: {
        vin,
        internal_serial,
        vehicleTypeId,
        makeId,
        modelId,
        year,
        colorId,
        engineTypeId,
        fuelTypeId,
        transmissionId,        
        mileage,
        batteryCapacity,
        range,
        wheelCount,
        price,
        statusId,
        stockNumber,      
        description,       
      },
    });

    res.status(201).json(vehicle);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error creating vehicle: " + error.message });
    } else {
      res.status(500).json({ message: "Unknown error" });
    }
  }
};

// Obtener un vehículo por ID
export const getVehicleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const vehicle = await prisma.vehicles.findUnique({
      where: { vehicleId: Number(id) },
      include: {
        make: true,
        model: true,
        color: true,
        engineType: true,
        fuelType: true,
        transmission: true,
        status: true,
        vehicleType: true,
      },
    });
    if (!vehicle) {
      res.status(404).json({ message: "Vehicle not found" });
    } else {
      res.json(vehicle);
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
      vehicleTypeId,
      makeId,
      modelId,
      year,
      colorId,
      engineTypeId,
      fuelTypeId,
      transmissionId,
      mileage,
      batteryCapacity,
      range,
      wheelCount,
      price,
      statusId,
      stockNumber,
      barcode,
      qrCode,
      description,     
    } = req.body;

    const vehicle = await prisma.vehicles.update({
      where: { vehicleId: Number(id) },
      data: {
        vin,
        internal_serial,
        vehicleTypeId,
        makeId,
        modelId,
        year,
        colorId,
        engineTypeId,
        fuelTypeId,
        transmissionId,
        mileage,
        batteryCapacity,
        range,
        wheelCount,
        price,
        statusId,
        stockNumber,
        barcode,
        qrCode,
        description,    
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
