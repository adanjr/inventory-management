import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obtener todos los permisos
export const getPermissions2 = async (req: Request, res: Response): Promise<void> => {
  try {
    const permissions = await prisma.permission.findMany();
    res.json(permissions);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving roles: ${error.message}` });
  }
};

export const getPermissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const modules = await prisma.module.findMany({
      include: {
        permissions: {
          where: { subModuleId: null }, // Filtra solo los permisos de nivel de módulo
        },
        subModules: {
          include: {
            permissions: true, // Obtiene todos los permisos para cada submódulo
          },
        },
      },
    });
    
    // Filtramos los permisos de los submódulos para que solo incluyan los del módulo padre correspondiente
    const filteredModules = modules.map(module => ({
      moduleId: module.moduleId,
      moduleName: module.name,
      permissions: module.permissions.map(permission => ({
        permissionId: permission.permissionId,
        name: permission.name,
        description: permission.description,
      })),
      subModules: module.subModules.map(subModule => ({
        subModuleId: subModule.subModuleId,
        subModuleName: subModule.name,
        permissions: subModule.permissions
          .filter(permission => permission.moduleId === module.moduleId) // Filtra permisos del submódulo que coinciden con el módulo padre
          .map(permission => ({
            permissionId: permission.permissionId,
            name: permission.name,
            description: permission.description,
          })),
      })),
    }));
    
    res.json(filteredModules);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving permissions: ${error.message}` });
  }
};
 