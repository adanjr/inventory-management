import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todas las condiciones de vehículos (Nuevo, Usado, etc.)
export const getVehicleConditions = async (req: Request, res: Response): Promise<void> => {
  try {
    const conditions = await prisma.vehicleCondition.findMany({
      include: {
        vehicles: true, // Incluye los vehículos relacionados (opcional)
      },
    });
    res.json(conditions);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vehicle conditions" });
  }
};

// Crear una nueva condición de vehículo
export const createVehicleCondition = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    const condition = await prisma.vehicleCondition.create({
      data: {
        name,
      },
    });

    res.status(201).json(condition);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error creating vehicle condition: " + error.message });
    } else {
      res.status(500).json({ message: "Unknown error" });
    }
  }
};

// Obtener una condición de vehículo por ID
export const getVehicleConditionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const condition = await prisma.vehicleCondition.findUnique({
      where: { conditionId: Number(id) },
      include: {
        vehicles: true, // Incluye los vehículos relacionados (opcional)
      },
    });

    if (!condition) {
      res.status(404).json({ message: "Vehicle condition not found" });
    } else {
      res.json(condition);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vehicle condition" });
  }
};

// Actualizar una condición de vehículo por ID
export const updateVehicleCondition = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const condition = await prisma.vehicleCondition.update({
      where: { conditionId: Number(id) },
      data: {
        name,
      },
    });

    res.json(condition);
  } catch (error) {
    res.status(500).json({ message: "Error updating vehicle condition" });
  }
};

// Eliminar una condición de vehículo por ID
export const deleteVehicleCondition = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.vehicleCondition.delete({
      where: { conditionId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting vehicle condition" });
  }
};
