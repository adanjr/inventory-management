import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todas las ubicaciones de inventario de vehículos
export const getVehicleInventoryLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicleInventoryLocations = await prisma.vehicleInventoryLocations.findMany({
      include: {
        vehicle: true,  // Incluye los detalles del vehículo
        location: true, // Incluye los detalles de la ubicación
      },
    });
    res.json(vehicleInventoryLocations);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vehicle inventory locations" });
  }
};

// Crear una nueva ubicación de inventario de vehículos
export const createVehicleInventoryLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vehicleId, locationId, status } = req.body;

    const vehicleInventoryLocation = await prisma.vehicleInventoryLocations.create({
      data: {
        vehicleId,
        locationId,
        status,
      },
    });

    res.status(201).json(vehicleInventoryLocation);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error creating vehicle inventory location: " + error.message });
    } else {
      res.status(500).json({ message: "Unknown error" });
    }
  }
};

// Obtener una ubicación de inventario de vehículo por ID
export const getVehicleInventoryLocationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const vehicleInventoryLocation = await prisma.vehicleInventoryLocations.findUnique({
      where: { vehicleInventoryLocationId: Number(id) },
      include: {
        vehicle: true,  // Incluye los detalles del vehículo
        location: true, // Incluye los detalles de la ubicación
      },
    });

    if (!vehicleInventoryLocation) {
      res.status(404).json({ message: "Vehicle inventory location not found" });
    } else {
      res.json(vehicleInventoryLocation);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vehicle inventory location" });
  }
};

// Actualizar una ubicación de inventario de vehículo por ID
export const updateVehicleInventoryLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { vehicleId, locationId, status } = req.body;

    const vehicleInventoryLocation = await prisma.vehicleInventoryLocations.update({
      where: { vehicleInventoryLocationId: Number(id) },
      data: {
        vehicleId,
        locationId,
        status,
      },
    });

    res.json(vehicleInventoryLocation);
  } catch (error) {
    res.status(500).json({ message: "Error updating vehicle inventory location" });
  }
};

// Eliminar una ubicación de inventario de vehículo por ID
export const deleteVehicleInventoryLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.vehicleInventoryLocations.delete({
      where: { vehicleInventoryLocationId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting vehicle inventory location" });
  }
};
