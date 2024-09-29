import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todas las ubicaciones o buscar por nombre
export const getLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const locations = await prisma.locations.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving locations" });
  }
};

// Crear una nueva ubicación
export const createLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, type, address, postalCode, city, state, country, managerId, latitude, longitude } = req.body;
    const location = await prisma.locations.create({
      data: {
        name,
        type,
        address,
        postalCode,
        city,
        state,
        country,
        managerId,
        latitude,
        longitude,
      },
    });
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: "Error creating location" });
  }
};

// Obtener una ubicación por ID
export const getLocationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const location = await prisma.locations.findUnique({
      where: { locationId: Number(id) },
    });
    if (!location) {
      res.status(404).json({ message: "Location not found" });
    } else {
      res.json(location);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving location" });
  }
};

// Actualizar una ubicación por ID
export const updateLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, type, address, postalCode, city, state, country, managerId, latitude, longitude } = req.body;
    const location = await prisma.locations.update({
      where: { locationId: Number(id) },
      data: {
        name,
        type,
        address,
        postalCode,
        city,
        state,
        country,
        managerId,
        latitude,
        longitude,
      },
    });
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: "Error updating location" });
  }
};

// Eliminar una ubicación por ID
export const deleteLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.locations.delete({
      where: { locationId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting location" });
  }
};
