import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los tipos de motor o buscar por nombre
export const getEngineTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const engineTypes = await prisma.engineTypes.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(engineTypes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving engine types" });
  }
};

// Crear un nuevo tipo de motor
export const createEngineType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const engineType = await prisma.engineTypes.create({
      data: {
        name,
        description,
      },
    });
    res.status(201).json(engineType);
  } catch (error) {
    res.status(500).json({ message: "Error creating engine type" });
  }
};

// Obtener un tipo de motor por ID
export const getEngineTypeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const engineType = await prisma.engineTypes.findUnique({
      where: { engineTypeId: Number(id) },
    });
    if (!engineType) {
      res.status(404).json({ message: "Engine type not found" });
    } else {
      res.json(engineType);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving engine type" });
  }
};

// Actualizar un tipo de motor por ID
export const updateEngineType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const engineType = await prisma.engineTypes.update({
      where: { engineTypeId: Number(id) },
      data: {
        name,
        description,
      },
    });
    res.json(engineType);
  } catch (error) {
    res.status(500).json({ message: "Error updating engine type" });
  }
};

// Eliminar un tipo de motor por ID
export const deleteEngineType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.engineTypes.delete({
      where: { engineTypeId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting engine type" });
  }
};
