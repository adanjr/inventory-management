import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los tipos de vehículos o buscar por nombre
export const getVehicleTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const vehicleTypes = await prisma.vehicleTypes.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(vehicleTypes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vehicle types" });
  }
};

// Crear un nuevo tipo de vehículo
export const createVehicleType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const vehicleType = await prisma.vehicleTypes.create({
      data: {
        name,
      },
    });
    res.status(201).json(vehicleType);
  } catch (error) {
    res.status(500).json({ message: "Error creating vehicle type" });
  }
};

// Obtener un tipo de vehículo por ID
export const getVehicleTypeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const vehicleType = await prisma.vehicleTypes.findUnique({
      where: { vehicleTypeId: Number(id) },
    });
    if (!vehicleType) {
      res.status(404).json({ message: "Vehicle type not found" });
    } else {
      res.json(vehicleType);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vehicle type" });
  }
};

// Actualizar un tipo de vehículo por ID
export const updateVehicleType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const vehicleType = await prisma.vehicleTypes.update({
      where: { vehicleTypeId: Number(id) },
      data: {
        name,
      },
    });
    res.json(vehicleType);
  } catch (error) {
    res.status(500).json({ message: "Error updating vehicle type" });
  }
};

// Eliminar un tipo de vehículo por ID
export const deleteVehicleType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.vehicleTypes.delete({
      where: { vehicleTypeId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting vehicle type" });
  }
};
