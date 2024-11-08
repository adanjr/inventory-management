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
      include: {
        rolePermissions: {
          include: {
            permission: {
              include: {
                module: true,
                subModule: true,
              },
            },
          },
        },
      },
    });

    if (role) {
      // Agrupamos los permisos primero por módulo y luego por submódulo
      const groupedPermissions = role.rolePermissions.reduce((acc, rolePermission) => {
        const permission = rolePermission.permission;
        const module = permission.module;
        const subModule = permission.subModule;

        // Buscamos el módulo en el acumulador
        let moduleGroup = acc.find((m) => m.moduleId === module?.moduleId);

        // Si el módulo no existe en el acumulador, lo añadimos
        if (!moduleGroup && module) {
          moduleGroup = {
            moduleId: module.moduleId,
            moduleName: module.name,
            permissions: [],
            subModules: [],
          };
          acc.push(moduleGroup);
        }

        // Añadimos el permiso a nivel de módulo (subModuleId debe ser null)
        if (!subModule && moduleGroup) {
          moduleGroup.permissions.push({
            permissionId: permission.permissionId,
            name: permission.name,
            description: permission.description,
            //subModuleId: null,
          });
        }

        // Si el permiso está asociado a un submódulo, lo añadimos al submódulo correspondiente
        if (subModule && moduleGroup) {
          // Buscamos el submódulo dentro del módulo
          let subModuleGroup = moduleGroup.subModules.find((sm: { subModuleId: number; }) => sm.subModuleId === subModule.subModuleId);

          // Si el submódulo no existe, lo creamos
          if (!subModuleGroup) {
            subModuleGroup = {
              subModuleId: subModule.subModuleId,
              subModuleName: subModule.name,
              permissions: [],
            };
            moduleGroup.subModules.push(subModuleGroup);
          }

          // Añadimos el permiso al submódulo
          subModuleGroup.permissions.push({
            permissionId: permission.permissionId,
            name: permission.name,
            description: permission.description,
            moduleId: module?.moduleId,
          });
        }

        return acc;
      }, [] as any[]);

      // Estructuramos la respuesta final con el rol y permisos agrupados
      const roleWithPermissions = {
        roleId: role.roleId,
        name: role.name,
        description: role.description,
        permissions: groupedPermissions,
      };

      res.json(roleWithPermissions);
    } else {
      res.status(404).json({ message: "Role not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving role: ${error.message}` });
  }
};

export const getRolePermissions = async (req: Request, res: Response): Promise<void> => {
  const { roleId, moduleId, subModuleId } = req.query;

  try {
    // Construimos el filtro base para roleId y moduleId
    const filter: any = {
      roleId: Number(roleId),
      permission: {
        moduleId: Number(moduleId),
      },
    };

    // Agregamos subModuleId al filtro si se proporciona
    if (subModuleId) {
      filter.permission.subModuleId = Number(subModuleId);
    }

    const rolePermissions = await prisma.rolePermission.findMany({
      where: filter,
      include: {
        permission: {
          include: {
            module: true,
            subModule: true,
          },
        },
      },
    });

    // Verificamos si se encontraron permisos
    if (rolePermissions.length > 0) {
      const permissions = rolePermissions.map((rolePermission) => ({
        permissionId: rolePermission.permission.permissionId,
        name: rolePermission.permission.name,
        description: rolePermission.permission.description,
        module: rolePermission.permission.module
          ? {
              moduleId: rolePermission.permission.module.moduleId,
              name: rolePermission.permission.module.name,
            }
          : null,
        subModule: rolePermission.permission.subModule
          ? {
              subModuleId: rolePermission.permission.subModule.subModuleId,
              name: rolePermission.permission.subModule.name,
            }
          : null,
      }));

      res.json({ roleId: Number(roleId), moduleId: Number(moduleId), subModuleId: subModuleId ? Number(subModuleId) : null, permissions });
    } else {
      res.status(404).json({ message: "No permissions found for the specified role and module criteria." });
    }
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving permissions: ${error.message}` });
  }
};

export const getRolePermissionsByName = async (req: Request, res: Response): Promise<void> => {
  const { roleId } = req.params;
  const { permissionName } = req.query;
  
  try {
    const rolePermissions = await prisma.rolePermission.findMany({
      where: {
        roleId: Number(roleId),
        permission: {
          name: String(permissionName),
        },
      },
      include: {
        permission: {
          include: {
            module: true,
            subModule: true,
          },
        },
      },
    });

    if (rolePermissions.length > 0) {
      // Crear un objeto para almacenar los módulos
      const modulesMap = new Map<number, { name: string, submodules: { name: string }[] }>();

      // Organizar permisos en módulos y submódulos
      rolePermissions.forEach((rolePermission) => {
        const { module, subModule } = rolePermission.permission;

        // Si el módulo existe, manejar submódulos
        if (module) {
          // Si el módulo aún no está en el mapa, lo agregamos
          if (!modulesMap.has(module.moduleId)) {
            modulesMap.set(module.moduleId, {
              name: module.name,
              submodules: subModule ? [{ name: subModule.name }] : [] // Si hay submódulo, lo agregamos; si no, dejamos el arreglo vacío
            });
          } else {
            const currentModule = modulesMap.get(module.moduleId);
            if (currentModule && subModule) {
              // Si ya existe el módulo y hay submódulos, los agregamos al arreglo
              currentModule.submodules.push({ name: subModule.name });
            }
          }
        }
      });

      // Convertir el mapa a un arreglo de módulos
      const modules = Array.from(modulesMap.values());

      // Estructurar la respuesta
      res.json({ roleId: Number(roleId), modules });
    } else {
      res.status(404).json({ message: "No permissions found for the specified role and permission name." });
    }
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving permissions: ${error.message}` });
  }
};

export const getRolePermissionsByModule = async (req: Request, res: Response): Promise<void> => {
  const { roleId } = req.params;
  const { moduleName, subModuleName } = req.query;
 
  try {
    const rolePermissions = await prisma.rolePermission.findMany({
      where: {
        roleId: Number(roleId),
        permission: {
          module: {
            name: moduleName ? String(moduleName) : undefined,  // Filtrar por moduleName si se proporciona
          },
          subModule: {
            name: subModuleName ? String(subModuleName) : undefined,  // Filtrar por subModuleName si se proporciona
          },
        },
      },
      include: {
        permission: {
          select: {
            name: true,  // Solo seleccionar el nombre del permiso
          },
        },
      },
    });

    const permissions = rolePermissions.length > 0
      ? rolePermissions.map((rolePermission) => rolePermission.permission.name)
      : []; // Array vacío si no hay permisos

    res.json({ roleId: Number(roleId), permissions });
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving permissions: ${error.message}` });
  }
};




// Crear un nuevo rol
export const createRole = async (req: Request, res: Response): Promise<void> => {
  const { name, description } = req.body;

  try {
    const newRole = await prisma.roles.create({
      data: { name, description },
    });
    res.status(201).json(newRole);
  } catch (error: any) {
    res.status(500).json({ message: `Error creating role: ${error.message}` });
  }
};

// Actualizar un rol
export const updateRole = async (req: Request, res: Response): Promise<void> => {
  const { roleId } = req.params;
  const { name, description, permissions } = req.body;

  try {
    // 1. Actualizar el nombre y la descripción del rol
    const updatedRole = await prisma.roles.update({
      where: { roleId: Number(roleId) },
      data: { 
        name,
        description, // Actualizar también la descripción
      },
    });

    // 2. Obtener los permisos actuales del rol en `RolePermission`
    const existingRolePermissions = await prisma.rolePermission.findMany({
      where: { roleId: Number(roleId) },
      include: { permission: true },
    });

    // 3. Preparar conjuntos para permisos a añadir y a eliminar
    const permissionsToKeep = new Set<string>();
    const permissionsToAdd: Array<{ moduleId: number; subModuleId: number | null; name: string }> = [];

    // Convertir la entrada `permissions` en un Set para un fácil manejo
    const newPermissionsSet = new Set(
      permissions.map((perm: { moduleId: number; subModuleId: number | null; name: string }) =>
        JSON.stringify(perm)
      )
    );

    // 4. Revisar cada permiso existente y decidir si se mantiene o se elimina
    for (const existingPerm of existingRolePermissions) {
      const permissionKey = JSON.stringify({
        moduleId: existingPerm.permission.moduleId,
        subModuleId: existingPerm.permission.subModuleId,
        name: existingPerm.permission.name,
      });

      if (newPermissionsSet.has(permissionKey)) {
        permissionsToKeep.add(permissionKey); // Marcar para mantener
        newPermissionsSet.delete(permissionKey); // Eliminar del set de nuevos permisos
      } else {
        // Eliminar `RolePermission` si no está en `permissions`
        await prisma.rolePermission.delete({
          where: { id: existingPerm.id },
        });
      }
    }

    // 5. Añadir nuevos permisos que no están en `RolePermission`
    for (const perm of newPermissionsSet) {
      const parsedPerm = JSON.parse(perm as string);
      const existingPermission = await prisma.permission.findFirst({
        where: {
          moduleId: parsedPerm.moduleId,
          subModuleId: parsedPerm.subModuleId,
          name: parsedPerm.name,
        },
      });

      if (existingPermission) {
        await prisma.rolePermission.create({
          data: {
            roleId: Number(roleId),
            permissionId: existingPermission.permissionId,
          },
        });
      } else {
        const newPermission = await prisma.permission.create({
          data: {
            moduleId: parsedPerm.moduleId,
            subModuleId: parsedPerm.subModuleId,
            name: parsedPerm.name,
          },
        });
        await prisma.rolePermission.create({
          data: {
            roleId: Number(roleId),
            permissionId: newPermission.permissionId,
          },
        });
      }
    }

    res.json({ message: "Role and permissions updated successfully", role: updatedRole });
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
