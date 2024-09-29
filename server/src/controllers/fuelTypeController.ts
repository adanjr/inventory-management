import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los tipos de combustible o buscar por nombre
export const getFuelTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const fuelTypes = await prisma.fuelTypes.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(fuelTypes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving fuel types" });
  }
};

// Crear un nuevo tipo de combustible
export const createFuelType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const fuelType = await prisma.fuelTypes.create({
      data: {
        name,
      },
    });
    res.status(201).json(fuelType);
  } catch (error) {
    res.status(500).json({ message: "Error creating fuel type" });
  }
};

// Obtener un tipo de combustible por ID
export const getFuelTypeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const fuelType = await prisma.fuelTypes.findUnique({
      where: { fuelTypeId: Number(id) },
    });
    if (!fuelType) {
      res.status(404).json({ message: "Fuel type not found" });
    } else {
      res.json(fuelType);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving fuel type" });
  }
};

// Actualizar un tipo de combustible por ID
export const updateFuelType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const fuelType = await prisma.fuelTypes.update({
      where: { fuelTypeId: Number(id) },
      data: {
        name,
      },
    });
    res.json(fuelType);
  } catch (error) {
    res.status(500).json({ message: "Error updating fuel type" });
  }
};

// Eliminar un tipo de combustible por ID
export const deleteFuelType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.fuelTypes.delete({
      where: { fuelTypeId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting fuel type" });
  }
};
