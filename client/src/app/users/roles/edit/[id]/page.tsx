"use client";

import { useState, useEffect } from "react";
import {  useUpdateRoleMutation,
          useGetRoleByIdQuery, 
          useGetPermissionsQuery,
          Role,
          useCreateRoleMutation, 
          NewRole,
          Module,
          SubModule,
          Permission,
} from "@/state/api";
import { useRouter } from "next/navigation";
import { UpdatedRolePermission } from '../../../../../state/api';

const permissionsLabels = ["ACCESS", "ADD", "EDIT", "DELETE", "LIST", "VIEW_DETAIL", "EXPORT", "APPROVE"];

const EditRole = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const id = params.id;
  const { data: role, isLoading: roleLoading } = useGetRoleByIdQuery(id);
  const { data: modules, isLoading: modulesLoading } = useGetPermissionsQuery();
  const [updateRole] = useUpdateRoleMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",    
  });
  
console.log("Rol:",role);

  const [permissionsState, setPermissionsState] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (role) {
      setFormData({ name: role.name!, description: role.description! });
      // Inicializa el estado de permisos desde `role`
      const initialPermissions: { [key: string]: boolean } = {};
      role.permissions.forEach((mod) => {
        mod.permissions.forEach((perm) => {
          const key = `${mod.moduleId}-${null}-${perm.name}`;
          initialPermissions[key] = true;
        });
        mod.subModules.forEach((sub) => {
          sub.permissions.forEach((perm) => {
            const key = `${mod.moduleId}-${sub.subModuleId}-${perm.name}`;
            initialPermissions[key] = true;
          });
        });
      });
      setPermissionsState(initialPermissions);
    }
  }, [role]);

  const handleCheckboxChange = (moduleId: number, subModuleId: number | null, permissionName: string) => {
    const key = `${moduleId}-${subModuleId}-${permissionName}`;
    setPermissionsState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
    }));
  };
     
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const checkedPermissions = Object.entries(permissionsState)
      .filter(([_, isChecked]) => isChecked)
      .map(([key]) => {
        const [moduleId, subModuleId, permissionName] = key.split("-");
        return {
          moduleId: Number(moduleId),
          subModuleId: subModuleId === "null" ? null : Number(subModuleId),
          name: permissionName,
        };
      });
      
      const data = {
        name: formData.name,
        description: formData.description,
        permissions: checkedPermissions, // Array con los permisos seleccionados
      };

      console.log("description",formData.description);

    await updateRole({ id: id, data });
    router.push("/users"); 
  };

  const handleBack = () => {
    router.push("/users");  
  };

  const hasPermission = (moduleId: number, subModuleId: number| null, permissionName: string) => {
    return role?.permissions?.some((mod) => 
      mod.moduleId === moduleId &&
      (subModuleId ? mod.subModules.some(sub => sub.subModuleId === subModuleId && sub.permissions.some(p => p.name === permissionName)) 
                   : mod.permissions.some(p => p.name === permissionName))
    );
  };

  return (
    <div className="mx-auto p-6 max-w-6xl bg-white shadow-md rounded-lg">
    <h2 className="text-3xl font-bold mb-6 text-center">Editar Rol</h2>
    
    <form onSubmit={handleSubmit} className="w-full">
      {/* Nombre de Rol */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="sm:col-span-3">
          <label className="block text-gray-700 font-semibold">Nombre de Rol</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>
      </div>
  
      {/* Descripción */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 mt-4">
        <div className="sm:col-span-3">
          <label className="block text-gray-700 font-semibold">Descripción</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>
      </div>
  
      {/* Secciones de Permisos */}
      <div className="mt-8 space-y-8">
      {modules && (
        <div className="mt-8 space-y-8">
          {modules.map((module) => (
            <div key={module.moduleId} className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-700 border-b border-gray-300 mb-4">
                {module.moduleName}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead>
                    <tr>
                    <th className="px-4 py-2 border border-gray-200 text-left">MODULO</th>
                      <th className="px-4 py-2 border border-gray-200 text-left">SUBMODULO</th>
                      {permissionsLabels.map((perm) => (
                        <th key={perm} className="px-4 py-2 border border-gray-200 text-center">
                          {perm}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Permisos a nivel de módulo */}
                    <tr>
                      <td className="px-4 py-2 border border-gray-200 text-left font-semibold">
                        {module.moduleName.toUpperCase()}
                      </td>
                      <td className="px-4 py-2 border border-gray-200 text-left font-semibold">                         
                      </td>
                      {permissionsLabels.map((perm) => (
                        <td key={`${module.moduleId}-${perm}`} className="px-4 py-2 border border-gray-200 text-center">
                          
                          {module.permissions.some((p) => p.name === perm) && (
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-blue-600"
                              checked={permissionsState[`${module.moduleId}-null-${perm}`] || false}
                              onChange={() => handleCheckboxChange(module.moduleId, null, perm)}
                            />
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Permisos a nivel de submódulo */}
                    {module.subModules.map((subModule) => (
                      <tr key={subModule.subModuleId}>
                        <td className="px-4 py-2 border border-gray-200 text-left font-semibold">                         
                        </td>
                        <td className="px-4 py-2 border border-gray-200 text-left font-semibold">
                          {subModule.subModuleName}
                        </td>
                        {permissionsLabels.map((perm) => (
                          <td key={`${subModule.subModuleId}-${perm}`} className="px-4 py-2 border border-gray-200 text-center">
                            {subModule.permissions.some((p) => p.name === perm) && (
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-blue-600"
                              checked={permissionsState[`${module.moduleId}-${subModule.subModuleId}-${perm}`] || false}
                              onChange={() => handleCheckboxChange(module.moduleId, subModule.subModuleId, perm)}
                            />
                          )}                          
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

  
      {/* Botones de Acción */}
      <div className="flex justify-start mt-6 space-x-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Guardar Cambios
        </button>
        <button
          type="button"
          onClick={handleBack}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
  
  );
};

export default EditRole;
