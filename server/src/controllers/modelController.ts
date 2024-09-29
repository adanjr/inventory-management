import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los modelos o buscar por nombre
export const getModels = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const models = await prisma.models.findMany({
      where: {
        name: {
          contains: search,
        },
      },
      include: {
        make: true,  // Incluir la marca relacionada
      },
    });
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving models" });
  }
};

// Crear un nuevo modelo
export const createModel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, makeId, year_start, year_end, type, battery_capacity, electric_range } = req.body;
    const model = await prisma.models.create({
      data: {
        name,
        makeId,
        year_start,
        year_end,
        type,
        battery_capacity,
        electric_range,
      },
    });
    res.status(201).json(model);
  } catch (error) {
    res.status(500).json({ message: "Error creating model" });
  }
};

// Obtener un modelo por ID
export const getModelById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const model = await prisma.models.findUnique({
      where: { modelId: Number(id) },
      include: {
        make: true,  // Incluir la marca relacionada
        vehicles: true, // Incluir vehículos relacionados si lo necesitas
      },
    });
    if (!model) {
      res.status(404).json({ message: "Model not found" });
    } else {
      res.json(model);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving model" });
  }
};

// Actualizar un modelo por ID
export const updateModel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, makeId, year_start, year_end, type, battery_capacity, electric_range } = req.body;
    const model = await prisma.models.update({
      where: { modelId: Number(id) },
      data: {
        name,
        makeId,
        year_start,
        year_end,
        type,
        battery_capacity,
        electric_range,
      },
    });
    res.json(model);
  } catch (error) {
    res.status(500).json({ message: "Error updating model" });
  }
};

// Eliminar un modelo por ID
export const deleteModel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.models.delete({
      where: { modelId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting model" });
  }
};
