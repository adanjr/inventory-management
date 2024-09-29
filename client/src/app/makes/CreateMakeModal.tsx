import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";

type MakeFormData = {
  makeId: string;
  name: string;
  country?: string;
  website?: string;
  phone?: string;
  mail?: string;
};

type CreateMakeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: MakeFormData) => void;
};

const CreateMakeModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateMakeModalProps) => {
  const [formData, setFormData] = useState({
    makeId: v4(),
    name: "",
    country: "",
    website: "",
    phone: "",
    mail: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Crear Nuevo Fabricante" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* MAKE NAME */}
          <label htmlFor="makeName" className={labelCssStyles}>
            Nombre de Fabricante
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

          {/* COUNTRY */}
          <label htmlFor="country" className={labelCssStyles}>
            País
          </label>
          <input
            type="text"
            name="country"
            placeholder="País"
            onChange={handleChange}
            value={formData.country}
            className={inputCssStyles}
          />

          {/* WEBSITE */}
          <label htmlFor="website" className={labelCssStyles}>
            Sitio Web
          </label>
          <input
            type="text"
            name="website"
            placeholder="Sitio Web"
            onChange={handleChange}
            value={formData.website}
            className={inputCssStyles}
          />

          {/* PHONE */}
          <label htmlFor="phone" className={labelCssStyles}>
            Teléfono
          </label>
          <input
            type="text"
            name="phone"
            placeholder="Teléfono"
            onChange={handleChange}
            value={formData.phone}
            className={inputCssStyles}
          />

          {/* EMAIL */}
          <label htmlFor="mail" className={labelCssStyles}>
            Correo Electrónico
          </label>
          <input
            type="email"
            name="mail"
            placeholder="Correo Electrónico"
            onChange={handleChange}
            value={formData.mail}
            className={inputCssStyles}
          />

          {/* CREATE ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Crear
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMakeModal;
