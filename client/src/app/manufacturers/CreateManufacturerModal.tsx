import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";

type ManufacturerFormData = {
  manufacturerId: string;
  name: string;
  country: string;
  contact_info: string;
};

type CreateManufacturerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ManufacturerFormData) => void;
};

const CreateManufacturerModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateManufacturerModalProps) => {
  const [formData, setFormData] = useState({
    manufacturerId: v4(),
    name: "",
    country: "",
    contact_info: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ manufacturerId: v4(), name: "", country: "", contact_info: "" });
    }
  }, [isOpen]);


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newManufacturer: ManufacturerFormData = {
      manufacturerId: formData.manufacturerId,
      name: formData.name,
      country: formData.country,
      contact_info: formData.contact_info,
    };
    onCreate(newManufacturer);
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Crear Nueva Marca" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* MANUFACTURER NAME */}
          <label htmlFor="manufacturerName" className={labelCssStyles}>
            Nombre de Marca
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
          <label htmlFor="manufacturerCountry" className={labelCssStyles}>
            Pais
          </label>
          <input
            type="text"
            name="country"
            placeholder="Pais"
            onChange={handleChange}
            value={formData.country}
            className={inputCssStyles}
            required
          />

          {/* CONTACT INFO */}
          <label htmlFor="contactInfo" className={labelCssStyles}>
            Info de Contacto
          </label>
          <input
            type="text"
            name="contact_info"
            placeholder="Info de Contacto"
            onChange={handleChange}
            value={formData.contact_info}
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
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateManufacturerModal;
