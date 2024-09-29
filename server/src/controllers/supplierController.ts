import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all suppliers or search by name
export const getSuppliers = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const suppliers = await prisma.suppliers.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving suppliers" });
  }
};

// Create a new supplier
export const createSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, address, postalCode, city, state, country, email, phone } = req.body;
    const supplier = await prisma.suppliers.create({
      data: {
        name,
        address,
        postalCode,
        city,
        state,
        country,
        email,
        phone,
      },
    });
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ message: "Error creating supplier" });
  }
};

// Get a supplier by ID
export const getSupplierById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supplier = await prisma.suppliers.findUnique({
      where: { supplierId: Number(id) },
    });
    if (!supplier) {
      res.status(404).json({ message: "Supplier not found" });
    } else {
      res.json(supplier);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving supplier" });
  }
};

// Update a supplier by ID
export const updateSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, address, postalCode, city, state, country, email, phone } = req.body;
    const supplier = await prisma.suppliers.update({
      where: { supplierId: Number(id) },
      data: { name, address, postalCode, city, state, country, email, phone },
    });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: "Error updating supplier" });
  }
};

// Delete a supplier by ID
export const deleteSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.suppliers.delete({
      where: { supplierId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting supplier" });
  }
};
