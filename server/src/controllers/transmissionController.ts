import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todas las transmisiones o buscar por tipo
export const getTransmissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const transmissions = await prisma.transmissions.findMany({
      where: {
        type: {
          contains: search,
        },
      },
    });
    res.json(transmissions);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving transmissions" });
  }
};

// Crear una nueva transmisión
export const createTransmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.body;
    const transmission = await prisma.transmissions.create({
      data: {
        type,
      },
    });
    res.status(201).json(transmission);
  } catch (error) {
    res.status(500).json({ message: "Error creating transmission" });
  }
};

// Obtener una transmisión por ID
export const getTransmissionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const transmission = await prisma.transmissions.findUnique({
      where: { transmissionId: Number(id) },
    });
    if (!transmission) {
      res.status(404).json({ message: "Transmission not found" });
    } else {
      res.json(transmission);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving transmission" });
  }
};

// Actualizar una transmisión por ID
export const updateTransmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const transmission = await prisma.transmissions.update({
      where: { transmissionId: Number(id) },
      data: {
        type,
      },
    });
    res.json(transmission);
  } catch (error) {
    res.status(500).json({ message: "Error updating transmission" });
  }
};

// Eliminar una transmisión por ID
export const deleteTransmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.transmissions.delete({
      where: { transmissionId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting transmission" });
  }
};
