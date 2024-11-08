"use client";

import { useState, useEffect } from "react";
import { Role, 
         useCreateRoleMutation, 
         NewRole,
} from "@/state/api";
import { useRouter } from "next/navigation";

const CreateRole = () => {
  const router = useRouter();
  const [createRole] = useCreateRoleMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
    }));
  };
     
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRole(formData);
    router.push("/users"); 
  };

  const handleBack = () => {
    router.push("/users");  
  };

  return (
    <div className="mx-auto p-6 max-w-6xl bg-white shadow-md rounded-lg">
  <h2 className="text-3xl font-bold mb-6 text-center">Agregar Nuevo Rol</h2>
  
  {/* Contenedor con scroll vertical */}
  <div className="overflow-y-auto max-h-[600px] p-4">
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
 
      {/* Botones de Acción */}
      <div className="flex justify-start mt-6 space-x-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Guardar Rol
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
</div>

  
  );
};

export default CreateRole;
