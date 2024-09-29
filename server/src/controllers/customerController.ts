import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los clientes o buscar por nombre
export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const customers = await prisma.customers.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving customers" });
  }
};

// Crear un nuevo cliente
export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, address, postalCode, city, state, country } = req.body;
    const customer = await prisma.customers.create({
      data: {
        name,
        email,
        phone,
        address,       // Opcional
        postalCode,    // Opcional
        city,          // Opcional
        state,         // Opcional
        country,       // Opcional
      },
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Error creating customer" });
  }
};

// Obtener un cliente por ID
export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const customer = await prisma.customers.findUnique({
      where: { customerId: Number(id) },
    });
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
    } else {
      res.json(customer);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving customer" });
  }
};

// Actualizar un cliente por ID
export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, postalCode, city, state, country } = req.body;
    const customer = await prisma.customers.update({
      where: { customerId: Number(id) },
      data: {
        name,
        email,
        phone,
        address,       // Opcional
        postalCode,    // Opcional
        city,          // Opcional
        state,         // Opcional
        country,       // Opcional
      },
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: "Error updating customer" });
  }
};

// Eliminar un cliente por ID
export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.customers.delete({
      where: { customerId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting customer" });
  }
};
