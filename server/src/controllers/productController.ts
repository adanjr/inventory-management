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
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const getProductsByLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString() || '';
    const locationId = req.query.locationId ? Number(req.query.locationId) : null;

    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      include: {
        inventoryLocations: {
          where: {
            locationId: locationId || undefined,
          },
          select: {
            locationId: true,
            quantity_in_stock: true,
            reorderPoint: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        manufacturer: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedProducts = products.map((product) => {
      // Encuentra el inventario en la ubicación específica si existe
      const inventoryInLocation = product.inventoryLocations[0];

      return {
        productId: product.productId,
        name: product.name,
        productCode: product.productCode,
        description: product.description,
        price: product.price,
        rating: product.rating,
        mainImageUrl: product.mainImageUrl,
        additionalImages: product.additionalImages,
        categoryId: product.categoryId,
        categoryName: product.category?.name || null, // Nombre de la categoría
        manufacturerId: product.manufacturerId,
        manufacturerName: product.manufacturer?.name || null, // Nombre del fabricante
        reorderQuantity: product.reorderQuantity,
        // Totales y cantidad en la ubicación
        quantityStock: product.stockQuantity, // Total stock del producto
        quantityStockInLocation: inventoryInLocation?.quantity_in_stock ?? 0, // Stock en la ubicación específica
        reorderPoint: inventoryInLocation?.reorderPoint ?? 0,  // Punto de reorden en la ubicación específica o general
      };
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving products by location' });
  }
};

// Obtener un producto por ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.products.findUnique({
      where: { productId: Number(id) },
      include: {
        category: true,        
        manufacturer: true,    
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
      productCode,
      description,
      price,
      rating,
      stockQuantity,
      reorderQuantity,
      categoryId,
      manufacturerId,
      mainImageUrl,
      additionalImages,
    } = req.body;

    const product = await prisma.products.create({
      data: {
        name,
        productCode,
        description,
        price,
        rating,
        stockQuantity,
        reorderQuantity,
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

    const locations = await prisma.locations.findMany();

    const inventoryEntries = locations.map((location) => ({
      productId: product.productId, // ID del producto recién creado
      locationId: location.locationId,
      quantity_in_stock: 0,
      reorderPoint: reorderQuantity,
    }));

    await prisma.inventoryLocations.createMany({
      data: inventoryEntries,
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
      productCode,
      description,
      price,
      rating,
      reorderQuantity,
      categoryId,
      manufacturerId,
    } = req.body;

    const product = await prisma.products.update({
      where: { productId: Number(productId) },
      data: {
        name,
        productCode,
        description,
        price,
        rating,
        reorderQuantity,
        category: {
          connect: { categoryId: Number(categoryId) },
        },
        manufacturer: {
          connect: { manufacturerId: Number(manufacturerId) },
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
    const { id } = req.params;
    await prisma.products.delete({
      where: { productId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};
