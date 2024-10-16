import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los colores o buscar por nombre
export const getColors = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const colors = await prisma.colors.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(colors);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving colors" });
  }
};

// Crear un nuevo color
export const createColor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, hexadecimal } = req.body;
    const color = await prisma.colors.create({
      data: {
        name,
        hexadecimal,
      },
    });
    res.status(201).json(color);
  } catch (error) {
    res.status(500).json({ message: "Error creating color" });
  }
};

// Obtener un color por ID
export const getColorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const color = await prisma.colors.findUnique({
      where: { colorId: Number(id) },
      include: {
        vehicles: true, // Incluir vehículos relacionados si es necesario
      },
    });
    if (!color) {
      res.status(404).json({ message: "Color not found" });
    } else {
      res.json(color);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving color" });
  }
};

// Actualizar un color por ID
export const updateColor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, hexadecimal } = req.body;
    const color = await prisma.colors.update({
      where: { colorId: Number(id) },
      data: {
        name,
        hexadecimal,
      },
    });
    res.json(color);
  } catch (error) {
    res.status(500).json({ message: "Error updating color" });
  }
};

// Eliminar un color por ID
export const deleteColor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.colors.delete({
      where: { colorId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting color" });
  }
};
