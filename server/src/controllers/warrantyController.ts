import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todas las garantías
export const getWarranties = async (req: Request, res: Response): Promise<void> => {
  try {
    const warranties = await prisma.warranty.findMany({
      include: {
        vehicle: true, // Incluye los detalles de los vehículos asociados
      },
    });
    res.json(warranties);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving warranties" });
  }
};

// Crear una nueva garantía
export const createWarranty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, durationMonths, description } = req.body;

    const warranty = await prisma.warranty.create({
      data: {
        name,
        durationMonths,       
        description,
      },
    });

    res.status(201).json(warranty);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error creating warranty: " + error.message });
    } else {
      res.status(500).json({ message: "Unknown error" });
    }
  }
};

// Obtener una garantía por ID
export const getWarrantyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const warranty = await prisma.warranty.findUnique({
      where: { warrantyId: Number(id) },
      include: {
        vehicle: true, // Incluye los detalles de los vehículos asociados
      },
    });

    if (!warranty) {
      res.status(404).json({ message: "Warranty not found" });
    } else {
      res.json(warranty);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving warranty" });
  }
};

// Actualizar una garantía por ID
export const updateWarranty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, durationMonths, description } = req.body;

    const warranty = await prisma.warranty.update({
      where: { warrantyId: Number(id) },
      data: {
        name,
        durationMonths,       
        description,
      },
    });

    res.json(warranty);
  } catch (error) {
    res.status(500).json({ message: "Error updating warranty" });
  }
};

// Eliminar una garantía por ID
export const deleteWarranty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.warranty.delete({
      where: { warrantyId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting warranty" });
  }
};
