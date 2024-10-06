import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los estados de disponibilidad de vehículos
export const getVehicleAvailabilityStatuses = async (req: Request, res: Response): Promise<void> => {
  try {
    const statuses = await prisma.vehicleAvailabilityStatus.findMany({
      include: {
        vehicles: true, // Incluye los vehículos relacionados (opcional)
      },
    });
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vehicle availability statuses" });
  }
};

// Crear un nuevo estado de disponibilidad de vehículo
export const createVehicleAvailabilityStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    const status = await prisma.vehicleAvailabilityStatus.create({
      data: {
        name,
      },
    });

    res.status(201).json(status);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error creating vehicle availability status: " + error.message });
    } else {
      res.status(500).json({ message: "Unknown error" });
    }
  }
};

// Obtener un estado de disponibilidad de vehículo por ID
export const getVehicleAvailabilityStatusById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const status = await prisma.vehicleAvailabilityStatus.findUnique({
      where: { statusId: Number(id) },
      include: {
        vehicles: true, // Incluye los vehículos relacionados (opcional)
      },
    });

    if (!status) {
      res.status(404).json({ message: "Vehicle availability status not found" });
    } else {
      res.json(status);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vehicle availability status" });
  }
};

// Actualizar un estado de disponibilidad de vehículo por ID
export const updateVehicleAvailabilityStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const status = await prisma.vehicleAvailabilityStatus.update({
      where: { statusId: Number(id) },
      data: {
        name,
      },
    });

    res.json(status);
  } catch (error) {
    res.status(500).json({ message: "Error updating vehicle availability status" });
  }
};

// Eliminar un estado de disponibilidad de vehículo por ID
export const deleteVehicleAvailabilityStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.vehicleAvailabilityStatus.delete({
      where: { statusId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting vehicle availability status" });
  }
};
