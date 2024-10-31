"use client";

import React, { ChangeEvent , useEffect, useState } from "react";
import { useGetRolesQuery,
         useGetUserByIdQuery,
         useGetLocationsQuery,
         User,
         useUpdateUserMutation} from "@/state/api";
import { useRouter } from 'next/navigation';


const EditUser = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const id = params.id;
  const { data: user, isLoading: userLoading } = useGetUserByIdQuery(id);

  const { data: locations, isLoading: locationsLoading } = useGetLocationsQuery();  
  const { data: roles, isLoading: rolesLoading } = useGetRolesQuery();

  const [updateUser] = useUpdateUserMutation();

  const [formData, setFormData] = useState({    
    username: "",
    name: "",     
    email: "",
    locationId: 0,
    roleId: 0,   
    profilePictureUrl: "",
  });
 
  useEffect(() => {
    if (user) {
      // Actualiza el formulario con los datos de la categoría seleccionada
      setFormData({
        username: user.username!,
        name: user.name!,
        email:user.email!,
        locationId: user.locationId || 0,
        roleId: user.roleId || 0,         
        profilePictureUrl: user.profilePictureUrl!,
      });
    }
  }, [user]);

  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const roleId = Number(event.target.value);
    setSelectedRoleId(roleId);
  
    // Actualizar el formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      roleId,   
      
    }));
  };
  
  const handlelocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = Number(event.target.value);
    setSelectedLocationId(locationId);
  
    // Actualizar el formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      locationId,   
      
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({ id: user?.cognitoId || '', data: formData });   
    router.push("/users"); // Redirect to vehicle list after updating
  };

  if (userLoading) {
    return <p>Cargando usuario...</p>; // Loading message
  }

  const handleBack = () => {
    router.push("/users"); // Redirigir a la lista de vehículos
  };

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles = "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (

<div className="mx-auto p-6 max-w-6xl bg-white shadow-md rounded-lg">
  <h2 className="text-3xl font-bold mb-6 text-center">Editar Usuario</h2>

  <form onSubmit={handleSubmit}>
    {/* Cambiamos grid-cols-1 a grid-cols-2 para obtener dos columnas */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className="block text-gray-700 font-semibold">Nombre de Usuario</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          readOnly
          className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold">Nombre Completo</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold">Correo Electrónico</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          readOnly
          className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-semibold">Rol</label>
        {rolesLoading ? (
          <p>Cargando...</p>
        ) : (
          <select
            name="roleId"
            value={formData.roleId}
            onChange={handleRoleChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          >
            <option value="">Seleccione el Rol</option>
            {roles?.map((role: any) => (
              <option key={role.roleId} value={role.roleId}>
                {role.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-semibold">Ubicación</label>
        {locationsLoading ? (
          <p>Cargando...</p>
        ) : (
          <select
            name="locationId"
            value={formData.locationId}
            onChange={handlelocationChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
          >
            <option value="">Seleccione Ubicación</option>
            {locations?.map((location: any) => (
              <option key={location.locationId} value={location.locationId}>
                {location.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-semibold">URL de Imagen Principal</label>
        <input
          type="text"
          name="mainImageUrl"
          value={formData.profilePictureUrl}
          onChange={handleInputChange}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
        />
      </div>
    </div>

    <div className="flex justify-between mt-6">
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Guardar Usuario
      </button>
      <button
        type="button"
        onClick={handleBack}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
      >
        Regresar a Usuarios
      </button>
    </div>
  </form>
</div>

  );
};

export default EditUser;
