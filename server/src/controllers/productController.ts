import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los productos o buscar por nombre
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
        },
      },
      include: {
        category: true,       // Incluir la categoría relacionada
        manufacturer: true,   // Incluir el fabricante relacionado
        location: true,       // Incluir la ubicación relacionada
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

// Obtener un producto por ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const product = await prisma.products.findUnique({
      where: { productId: Number(productId) },
      include: {
        category: true,       // Incluir la categoría relacionada
        manufacturer: true,   // Incluir el fabricante relacionado
        location: true,       // Incluir la ubicación relacionada
      },
    });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product" });
  }
};

// Crear un nuevo producto
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      price,
      rating,
      stockQuantity,
      categoryId,
      manufacturerId,
      locationId,
      mainImageUrl,
      additionalImages,
    } = req.body;

    const product = await prisma.products.create({
      data: {
        name,
        description,
        price,
        rating,
        stockQuantity,
        mainImageUrl,
        additionalImages,
        category: {
          connect: { categoryId: Number(categoryId) },
        },
        manufacturer: {
          connect: { manufacturerId: Number(manufacturerId) },
        },
        location: {
          connect: { locationId: Number(locationId) },
        },
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating product" });
  }
};

// Actualizar un producto por ID
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const {
      name,
      description,
      price,
      rating,
      stockQuantity,
      categoryId,
      manufacturerId,
      locationId,
      mainImageUrl,
      additionalImages,
    } = req.body;

    const product = await prisma.products.update({
      where: { productId: Number(productId) },
      data: {
        name,
        description,
        price,
        rating,
        stockQuantity,
        mainImageUrl,
        additionalImages,
        category: {
          connect: { categoryId: Number(categoryId) },
        },
        manufacturer: {
          connect: { manufacturerId: Number(manufacturerId) },
        },
        location: {
          connect: { locationId: Number(locationId) },
        },
      },
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

// Eliminar un producto por ID
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    await prisma.products.delete({
      where: { productId: Number(productId) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};
