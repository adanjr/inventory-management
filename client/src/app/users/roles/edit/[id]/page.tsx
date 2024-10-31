"use client";

import { useState, useEffect } from "react";
import {  useUpdateRoleMutation,
          useGetRoleByIdQuery, 
          Role,
          useCreateRoleMutation, 
          NewRole,
} from "@/state/api";
import { useRouter } from "next/navigation";

const EditRole = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const id = params.id;
  const { data: role, isLoading: roleLoading } = useGetRoleByIdQuery(id);

  const [updateRole] = useUpdateRoleMutation();

  const [formData, setFormData] = useState({
    name: "",
    //description: "",
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name!,       
      });
    }
  }, [role]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
    }));
  };
     
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateRole({ id: id, data: formData });
    router.push("/users"); 
  };

  const handleBack = () => {
    router.push("/users");  
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
            onChange={handleInputChange}
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
            //value={formData.description}
            onChange={handleInputChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          />
        </div>
      </div>
  
      {/* Secciones de Permisos */}
      <div className="mt-8 space-y-8">
        {[
          { section: "Contactos", categories: ["Clientes", "Proveedores" ] },
          { section: "Items", categories: ["Vehiculos","Productos", "Modelos", "Familias", "Inventario", "Categorías"] },
          { section: "Ventas", categories: ["Órdenes de Venta", "Devoluciones"] },
          { section: "Compras", categories: ["Órdenes de Compra", "Recibir Producto"] },
          { section: "Gastos", categories: ["Grafico", "Recibir Producto"] },
          { section: "Administración", categories: [ "Organizacion", "Usuarios", "Roles" , "Email" , "Monedas" , "Impuestos" ] },
        ].map(({ section, categories }) => (
          <div key={section} className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-2xl font-semibold text-gray-700 border-b border-gray-300 mb-4">{section}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border border-gray-200 text-left">Categoría</th>
                    {["Acceso Total", "Ver", "Agregar", "Editar", "Eliminar", "Aprobar"].map((perm) => (
                      <th key={perm} className="px-4 py-2 border border-gray-200 text-center">{perm}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category}>
                      <td className="px-4 py-2 border border-gray-200 text-left font-semibold">{category}</td>
                      {["Acceso Total", "Ver", "Agregar", "Editar", "Eliminar", "Aprobar"].map((perm) => (
                        <td key={perm} className="px-4 py-2 border border-gray-200 text-center">
                          <input
                            type="checkbox"
                            name={`${section}-${category}-${perm}`}
                            className="form-checkbox h-4 w-4 text-blue-600"
                          />
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
