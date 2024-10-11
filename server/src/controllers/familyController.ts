import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todas las marcas o buscar por nombre
export const getFamilies = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const makeId = parseInt(req.query.makeId as string); // Convierte makeId a número

    const families = await prisma.families.findMany({
      where: {
        makeId: makeId, // Filtra por el makeId si se proporciona
        name: search ? { contains: search } : undefined, // Filtra por nombre si se proporciona la búsqueda
      },
      include: {
        make: true, // Incluye la relación con Makes
      },
    });

    res.json(families);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving families" });
  }
};

// Crear una nueva marca
export const createFamily = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, year_start, year_end, makeId } = req.body;
    const family = await prisma.families.create({
      data: {
        name,
        description,
        year_start,
        year_end,
        makeId,
      },
    });
    res.status(201).json(family);
  } catch (error) {
    res.status(500).json({ message: "Error creating family" });
  }
};

// Obtener una marca por ID
export const getFamilyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const family = await prisma.families.findUnique({
      where: { familyId: Number(id) },
      include: {        
        models: true,    // Opción para incluir modelos relacionados
      },
    });
    if (!family) {
      res.status(404).json({ message: "Family not found" });
    } else {
      res.json(family);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving family" });
  }
};

// Actualizar una marca por ID
export const updateFamily = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, year_start, year_end, makeId  } = req.body;
    const family = await prisma.families.update({
      where: { familyId: Number(id) },
      data: {
        name,
        description,
        year_start,
        year_end,
        makeId,
      },
    });
    res.json(family);
  } catch (error) {
    res.status(500).json({ message: "Error updating family" });
  }
};

// Eliminar una marca por ID
export const deleteFamily = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.families.delete({
      where: { familyId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting family" });
  }
};
