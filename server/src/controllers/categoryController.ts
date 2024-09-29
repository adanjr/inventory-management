import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los clientes o buscar por nombre
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const categories = await prisma.categories.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving categories" });
  }
};

// Crear un nuevo cliente
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const category = await prisma.categories.create({
      data: {
        name,
        description,     
      },
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error creating category" });
  }
};

// Obtener un cliente por ID
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await prisma.categories.findUnique({
      where: { categoryId: Number(id) },
    });
    if (!category) {
      res.status(404).json({ message: "Category not found" });
    } else {
      res.json(category);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving category" });
  }
};

// Actualizar un cliente por ID
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await prisma.categories.update({
      where: { categoryId: Number(id) },
      data: {
        name,
        description,        
      },
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error updating category" });
  }
};

// Eliminar un cliente por ID
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.categories.delete({
      where: { categoryId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};
