import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const product = await prisma.products.findUnique({
      where: { productId: Number(productId) },
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

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, price, rating, stockQuantity, categoryId, manufacturerId, mainImageUrl, additionalImages } = req.body;

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
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating product" });
  }
};




export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params; // Obtener el productId de los parámetros de la ruta
    const { name, description, price, rating, stockQuantity, categoryId, manufacturerId, mainImageUrl, additionalImages } = req.body;
    const product = await prisma.products.update({
      where: { productId: Number(productId) }, // Buscando por productId
      data: {
        name,
        description,
        price,
        rating,
        stockQuantity,
        categoryId,
        manufacturerId,
        mainImageUrl,
        additionalImages,
      },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
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
