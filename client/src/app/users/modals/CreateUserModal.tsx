import React, { ChangeEvent, FormEvent, useState } from "react";
import { useGetRolesQuery, useGetLocationsQuery } from "@/state/api";
import Header from "@/app/(components)/Header";

type UserFormData = {
    username: string;
    name: string;
    email: string;
    password?: string;
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
    password: "",
    locationId: 0,
    roleId: 0,
    cognitoId: "",
    profilePictureUrl: "",
  });

  const { data: locations = [] } = useGetLocationsQuery();
  const { data: roles = [] } = useGetRolesQuery();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.endsWith("Id") ? parseFloat(value) : value,
    });
  };

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    setFormData((prevData) => ({ ...prevData, password }));
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
      password: "",
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
          {/* Username */}
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
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              onChange={handleChange}
              value={formData.email}
              className={inputCssStyles}
              required
            />
          </div>

          {/* Password */}
          <div className="col-span-1 md:col-span-1">
            <label htmlFor="password" className={labelCssStyles}>
              Contraseña
            </label>
            <div className="flex">
              <input
                type="text"
                name="password"
                placeholder="Genera una contraseña"
                onChange={handleChange}
                value={formData.password}
                className={inputCssStyles + " flex-grow mr-2"}
                required
              />
              <button
                type="button"
                onClick={generatePassword}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
              >
                Generar
              </button>
            </div>
          </div>

          {/* Role Selection */}
          <div className="col-span-1 md:col-span-1">
            <label htmlFor="roleId" className={labelCssStyles}>
              Rol
            </label>
            <select
              name="roleId"
              onChange={handleChange}
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
              onChange={handleChange}
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

          {/* Profile Picture URL */}
          <div className="col-span-1 md:col-span-1">
            <label htmlFor="profilePictureUrl" className={labelCssStyles}>
              URL de Imagen de Perfil
            </label>
            <input
              type="text"
              name="profilePictureUrl"
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
