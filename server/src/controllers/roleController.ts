import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los roles
export const getRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await prisma.roles.findMany();
    res.json(roles);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving roles: ${error.message}` });
  }
};

// Obtener un rol por su roleId
export const getRole = async (req: Request, res: Response): Promise<void> => {
  const { roleId } = req.params;
  try {
    const role = await prisma.roles.findUnique({
      where: { roleId: Number(roleId) },
    });

    if (role) {
      res.json(role);
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving role: ${error.message}` });
  }
};

// Crear un nuevo rol
export const createRole = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  try {
    const newRole = await prisma.roles.create({
      data: { name },
    });
    res.status(201).json(newRole);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating role: ${error.message}` });
  }
};

// Actualizar un rol
export const updateRole = async (req: Request, res: Response): Promise<void> => {
  const { roleId } = req.params;
  const { name } = req.body;

  try {
    const updatedRole = await prisma.roles.update({
      where: { roleId: Number(roleId) },
      data: { name },
    });
    res.json(updatedRole);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "Role not found" });
    } else {
      res.status(500).json({ message: `Error updating role: ${error.message}` });
    }
  }
};

// Eliminar un rol
export const deleteRole = async (req: Request, res: Response): Promise<void> => {
  const { roleId } = req.params;

  try {
    await prisma.roles.delete({
      where: { roleId: Number(roleId) },
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: "Role not found" });
    } else {
      res.status(500).json({ message: `Error deleting role: ${error.message}` });
    }
  }
};
