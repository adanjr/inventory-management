import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los fabricantes o buscar por nombre
export const getManufacturers = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const manufacturers = await prisma.manufacturer.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(manufacturers);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving manufacturers" });
  }
};

// Crear un nuevo fabricante
export const createManufacturer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { manufacturer_id, name, country, contact_info } = req.body;
    const manufacturer = await prisma.manufacturer.create({
      data: {
        manufacturer_id,
        name,
        country,
        contact_info,
      },
    });
    res.status(201).json(manufacturer);
  } catch (error) {
    res.status(500).json({ message: "Error creating manufacturer" });
  }
};

// Obtener un fabricante por ID
export const getManufacturerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { manufacturer_id: id },
    });
    if (!manufacturer) {
      res.status(404).json({ message: "Manufacturer not found" });
    } else {
      res.json(manufacturer);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving manufacturer" });
  }
};

// Actualizar un fabricante por ID
export const updateManufacturer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, country, contact_info } = req.body;
    const manufacturer = await prisma.manufacturer.update({
      where: { manufacturer_id: id },
      data: { name, country, contact_info },
    });
    res.json(manufacturer);
  } catch (error) {
    res.status(500).json({ message: "Error updating manufacturer" });
  }
};

// Eliminar un fabricante por ID
export const deleteManufacturer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.manufacturer.delete({
      where: { manufacturer_id: id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting manufacturer" });
  }
};