import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los movimientos
export const getMovements = async (req: Request, res: Response): Promise<void> => {
  try {
    const movements = await prisma.movements.findMany({
      include: {
        product: true,      // Incluye el producto asociado (opcional)
        vehicles: true,     // Incluye el vehículo asociado (opcional)
        fromLocation: true, // Incluye la ubicación de origen
        toLocation: true,   // Incluye la ubicación de destino
      },
    });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving movements" });
  }
};

// Crear un nuevo movimiento
export const createMovement = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      productId,
      vehicleId,
      fromLocationId,
      toLocationId,
      quantity,
      movementType,
      movementDate,
      status,
      notes,
    } = req.body;

    const movement = await prisma.movements.create({
      data: {
        productId,
        vehicleId,
        fromLocationId,
        toLocationId,
        quantity,
        movementType,
        movementDate,
        status,
        notes,
      },
    });

    res.status(201).json(movement);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error creating movement: " + error.message });
    } else {
      res.status(500).json({ message: "Unknown error" });
    }
  }
};

// Obtener un movimiento por ID
export const getMovementById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const movement = await prisma.movements.findUnique({
      where: { movementId: Number(id) },
      include: {
        product: true,      // Incluye el producto asociado (opcional)
        vehicles: true,     // Incluye el vehículo asociado (opcional)
        fromLocation: true, // Incluye la ubicación de origen
        toLocation: true,   // Incluye la ubicación de destino
      },
    });

    if (!movement) {
      res.status(404).json({ message: "Movement not found" });
    } else {
      res.json(movement);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving movement" });
  }
};

// Actualizar un movimiento por ID
export const updateMovement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      productId,
      vehicleId,
      fromLocationId,
      toLocationId,
      quantity,
      movementType,
      movementDate,
      status,
      notes,
    } = req.body;

    const movement = await prisma.movements.update({
      where: { movementId: Number(id) },
      data: {
        productId,
        vehicleId,
        fromLocationId,
        toLocationId,
        quantity,
        movementType,
        movementDate,
        status,
        notes,
      },
    });

    res.json(movement);
  } catch (error) {
    res.status(500).json({ message: "Error updating movement" });
  }
};

// Eliminar un movimiento por ID
export const deleteMovement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.movements.delete({
      where: { movementId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting movement" });
  }
};
