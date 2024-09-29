import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todas las marcas o buscar por nombre
export const getMakes = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const makes = await prisma.makes.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(makes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving makes" });
  }
};

// Crear una nueva marca
export const createMake = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, country, website, phone, mail } = req.body;
    const make = await prisma.makes.create({
      data: {
        name,
        country,
        website,
        phone,
        mail,
      },
    });
    res.status(201).json(make);
  } catch (error) {
    res.status(500).json({ message: "Error creating make" });
  }
};

// Obtener una marca por ID
export const getMakeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const make = await prisma.makes.findUnique({
      where: { makeId: Number(id) },
      include: {
        vehicles: true,  // Opción para incluir vehículos relacionados, si lo necesitas
        models: true,    // Opción para incluir modelos relacionados
      },
    });
    if (!make) {
      res.status(404).json({ message: "Make not found" });
    } else {
      res.json(make);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving make" });
  }
};

// Actualizar una marca por ID
export const updateMake = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, country, website, phone, mail } = req.body;
    const make = await prisma.makes.update({
      where: { makeId: Number(id) },
      data: {
        name,
        country,
        website,
        phone,
        mail,
      },
    });
    res.json(make);
  } catch (error) {
    res.status(500).json({ message: "Error updating make" });
  }
};

// Eliminar una marca por ID
export const deleteMake = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.makes.delete({
      where: { makeId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting make" });
  }
};
