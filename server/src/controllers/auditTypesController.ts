import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los tipos de auditoría
export const getAuditTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const auditTypes = await prisma.auditTypes.findMany({
      include: {
        auditLogs: true, // Incluir los registros de auditoría asociados (opcional)
      },
    });
    res.json(auditTypes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving audit types" });
  }
};

// Crear un nuevo tipo de auditoría
export const createAuditType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    const auditType = await prisma.auditTypes.create({
      data: { name },
    });

    res.status(201).json(auditType);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: "Error creating audit type: " + error.message });
    } else {
      res.status(500).json({ message: "Unknown error" });
    }
  }
};

// Obtener un tipo de auditoría por ID
export const getAuditTypeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const auditType = await prisma.auditTypes.findUnique({
      where: { auditTypeId: Number(id) },
      include: {
        auditLogs: true, // Incluir registros de auditoría relacionados (opcional)
      },
    });

    if (!auditType) {
      res.status(404).json({ message: "Audit type not found" });
    } else {
      res.json(auditType);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving audit type" });
  }
};

// Actualizar un tipo de auditoría por ID
export const updateAuditType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const auditType = await prisma.auditTypes.update({
      where: { auditTypeId: Number(id) },
      data: { name },
    });

    res.json(auditType);
  } catch (error) {
    res.status(500).json({ message: "Error updating audit type" });
  }
};

// Eliminar un tipo de auditoría por ID
export const deleteAuditType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.auditTypes.delete({
      where: { auditTypeId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting audit type" });
  }
};
