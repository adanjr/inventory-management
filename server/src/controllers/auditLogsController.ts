import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los registros de auditoría o buscar por vehicleId o auditType
export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vehicleId, auditTypeId } = req.query;

    const auditLogs = await prisma.auditLogs.findMany({
      where: {
        AND: [
          vehicleId ? { vehicleId: Number(vehicleId) } : {},
          auditTypeId ? { auditTypeId: Number(auditTypeId) } : {},
        ],
      },
      include: {
        vehicle: true, // Relación con el vehículo
        auditType: true, // Relación con el tipo de auditoría
      },
    });

    res.json(auditLogs);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving audit logs" });
  }
};

// Crear un nuevo registro de auditoría
export const createAuditLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vehicleId, auditDate, auditTypeId, notes } = req.body;

    const auditLog = await prisma.auditLogs.create({
      data: {
        vehicleId,
        auditDate: new Date(auditDate),
        auditTypeId,
        notes,
      },
    });

    res.status(201).json(auditLog);
  } catch (error) {
    res.status(500).json({ message: "Error creating audit log" });
  }
};

// Obtener un registro de auditoría por ID
export const getAuditLogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const auditLog = await prisma.auditLogs.findUnique({
      where: { auditLogId: Number(id) },
      include: {
        vehicle: true,
        auditType: true,
      },
    });

    if (!auditLog) {
      res.status(404).json({ message: "Audit log not found" });
    } else {
      res.json(auditLog);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving audit log" });
  }
};

// Actualizar un registro de auditoría por ID
export const updateAuditLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { vehicleId, auditDate, auditTypeId, notes } = req.body;

    const auditLog = await prisma.auditLogs.update({
      where: { auditLogId: Number(id) },
      data: {
        vehicleId,
        auditDate: new Date(auditDate),
        auditTypeId,
        notes,
      },
    });

    res.json(auditLog);
  } catch (error) {
    res.status(500).json({ message: "Error updating audit log" });
  }
};

// Eliminar un registro de auditoría por ID
export const deleteAuditLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.auditLogs.delete({
      where: { auditLogId: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting audit log" });
  }
};
