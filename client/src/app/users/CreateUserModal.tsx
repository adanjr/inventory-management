import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useGetRolesQuery,
         useGetLocationsQuery} from "@/state/api";
import Header from "@/app/(components)/Header";
import { v4 } from "uuid";

type UserFormData = {
    username: string;
    name: string;
    email: string;
    profilePictureUrl?: string;
    cognitoId?: string;
    roleId?: number;
    locationId?: number;
};

type CreateUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: UserFormData) => void;
};

const CreateUserModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateUserModalProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    name: "",     
    email: "",
    locationId: 0,
    roleId: 0,
    cognitoId: "",    
    profilePictureUrl: "",
  });

  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const { data: locations = [] } = useGetLocationsQuery();
  const { data: roles = [] } = useGetRolesQuery();

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
  
  useEffect(() => {
    if (locations.length > 0) {
      // Set the first location as default
      setSelectedLocationId(Number(locations[0].locationId));
    }
  }, [locations]);

  

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.endsWith("Id")  ? parseFloat(value) : value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
     handleClose();
  };

  const handleClose = () => {
    setFormData({
        username: "",
        name: "",     
        email: "",     
        locationId: 0,
        roleId: 0,
        cognitoId: "",    
        profilePictureUrl: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles = "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl h-auto shadow-lg rounded-md bg-white">
        <Header name="Crear Nuevo Usuario" />
        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User Name */}
          <div className="col-span-1 md:col-span-1">
            <label htmlFor="username" className={labelCssStyles}>
              Nombre de Usuario
            </label>
            <input
              type="text"
              name="username"
              placeholder="Nombre"
              onChange={handleChange}
              value={formData.username}
              className={inputCssStyles}
              required
            />
          </div>

          {/* Full Name */}
          <div className="col-span-1 md:col-span-1">
            <label htmlFor="name" className={labelCssStyles}>
              Nombre Completo
            </label>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              onChange={handleChange}
              value={formData.name}
              className={inputCssStyles}
              required
            />
          </div>

          {/* Email */}
          <div className="col-span-1 md:col-span-1">
            <label htmlFor="email" className={labelCssStyles}>
              Correo Electrónico
            </label>
            <input
              type="text"
              name="email"
              placeholder="Correo Electrónico"
              onChange={handleChange}
              value={formData.email}
              className={inputCssStyles}
              required
            />
          </div>

          {/* Role Selection */}
          <div className="col-span-1 md:col-span-1">
            <label htmlFor="roleId" className={labelCssStyles}>
              Rol
            </label>
            <select
              name="roleId"
              onChange={handleRoleChange}
              value={formData.roleId}
              className={inputCssStyles}
              required
            >
              <option value="">Selecciona un Rol</option>
              {roles.map((role) => (
                <option key={role.roleId} value={role.roleId}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location Selection */}
          <div className="col-span-1 md:col-span-1">
            <label htmlFor="locationId" className={labelCssStyles}>
              Ubicación
            </label>
            <select
              name="locationId"
              onChange={handlelocationChange}
              value={formData.locationId}
              className={inputCssStyles}
              required
            >
              <option value="">Selecciona una Ubicación</option>
              {locations.map((location) => (
                <option key={location.locationId} value={location.locationId}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          {/* Main Image URL */}
          <div className="col-span-1 md:col-span-1">
            <label htmlFor="mainImageUrl" className={labelCssStyles}>
              URL de Imagen Principal
            </label>
            <input
              type="string"
              name="mainImageUrl"
              placeholder="URL de Foto de Perfil"
              onChange={handleChange}
              value={formData.profilePictureUrl}
              className={inputCssStyles}
            />
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-400 text-white py-2 px-4 mr-2 rounded hover:bg-gray-500 transition duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Crear Usuario
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateUserModal;
