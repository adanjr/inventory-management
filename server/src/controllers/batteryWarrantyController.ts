import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todas las garantías
export const getBatteryWarranties = async (req: Request, res: Response): Promise<void> => {
  try {
    const batteryWarranties = await prisma.batteryWarranty.findMany({
      include: {
        vehicle: true, // Incluye los detalles de los vehículos asociados
      },
    });
    res.json(batteryWarranties);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving battery warranties" });
  }
};

// Crear una nueva garantía
export const createBatteryWarranty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, durationMonths, description } = req.body;

    const batterywarranty = await prisma.batteryWarranty.create({
      data: {
        name,
        durationMonths,
        description,
      },
    });

    res.status(201).json(batterywarranty);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error creating battery warranty: " + error.message });
    } else {
      res.status(500).json({ message: "Unknown error" });
    }
  }
};

// Obtener una garantía por ID
export const getBatteryWarrantyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const batterywarranty = await prisma.batteryWarranty.findUnique({
      where: { batteryWarrantyId: Number(id) },
      include: {
        vehicle: true, // Incluye los detalles de los vehículos asociados
      },
    });

    if (!batterywarranty) {
      res.status(404).json({ message: "Battery Warranty not found" });
    } else {
      res.json(batterywarranty);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving battery warranty" });
  }
};

// Actualizar una garantía por ID
export const updateBatteryWarranty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, durationMonths, description } = req.body;

    const batterywarranty = await prisma.batteryWarranty.update({
      where: { batteryWarrantyId: Number(id) },
      data: {
        name,
        durationMonths,        
        description,
      },
    });

    res.json(batterywarranty);
  } catch (error) {
    res.status(500).json({ message: "Error updating battery warranty" });
  }
};

// Eliminar una garantía por ID
export const deleteBatteryWarranty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.batteryWarranty.delete({
      where: { batteryWarrantyId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting battery warranty" });
  }
};
