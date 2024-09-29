import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los estados de vehículo o buscar por nombre
export const getVehicleStatuses = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const vehicleStatuses = await prisma.vehicleStatus.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(vehicleStatuses);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vehicle statuses" });
  }
};

// Crear un nuevo estado de vehículo
export const createVehicleStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const vehicleStatus = await prisma.vehicleStatus.create({
      data: {
        name,
      },
    });
    res.status(201).json(vehicleStatus);
  } catch (error) {
    res.status(500).json({ message: "Error creating vehicle status" });
  }
};

// Obtener un estado de vehículo por ID
export const getVehicleStatusById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const vehicleStatus = await prisma.vehicleStatus.findUnique({
      where: { statusId: Number(id) },
    });
    if (!vehicleStatus) {
      res.status(404).json({ message: "Vehicle status not found" });
    } else {
      res.json(vehicleStatus);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving vehicle status" });
  }
};

// Actualizar un estado de vehículo por ID
export const updateVehicleStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const vehicleStatus = await prisma.vehicleStatus.update({
      where: { statusId: Number(id) },
      data: {
        name,
      },
    });
    res.json(vehicleStatus);
  } catch (error) {
    res.status(500).json({ message: "Error updating vehicle status" });
  }
};

// Eliminar un estado de vehículo por ID
export const deleteVehicleStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.vehicleStatus.delete({
      where: { statusId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting vehicle status" });
  }
};
