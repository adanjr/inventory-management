import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todas las ubicaciones de inventario
export const getInventoryLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const inventoryLocations = await prisma.inventoryLocations.findMany({
      include: {
        product: true,  // Incluye el producto asociado (opcional)
        location: true, // Incluye la ubicación asociada
      },
    });
    res.json(inventoryLocations);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving inventory locations" });
  }
};

// Crear una nueva ubicación de inventario
export const createInventoryLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, locationId, quantity_in_stock } = req.body;

    const inventoryLocation = await prisma.inventoryLocations.create({
      data: {
        productId,
        locationId,
        quantity_in_stock,
      },
    });

    res.status(201).json(inventoryLocation);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error creating inventory location: " + error.message });
    } else {
      res.status(500).json({ message: "Unknown error" });
    }
  }
};

// Obtener una ubicación de inventario por ID
export const getInventoryLocationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const inventoryLocation = await prisma.inventoryLocations.findUnique({
      where: { inventoryLocationId: Number(id) },
      include: {
        product: true,  // Incluye el producto asociado (opcional)
        location: true, // Incluye la ubicación asociada
      },
    });

    if (!inventoryLocation) {
      res.status(404).json({ message: "Inventory location not found" });
    } else {
      res.json(inventoryLocation);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving inventory location" });
  }
};

// Actualizar una ubicación de inventario por ID
export const updateInventoryLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { productId, locationId, quantity_in_stock } = req.body;

    const inventoryLocation = await prisma.inventoryLocations.update({
      where: { inventoryLocationId: Number(id) },
      data: {
        productId,
        locationId,
        quantity_in_stock,
      },
    });

    res.json(inventoryLocation);
  } catch (error) {
    res.status(500).json({ message: "Error updating inventory location" });
  }
};

// Eliminar una ubicación de inventario por ID
export const deleteInventoryLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.inventoryLocations.delete({
      where: { inventoryLocationId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting inventory location" });
  }
};
