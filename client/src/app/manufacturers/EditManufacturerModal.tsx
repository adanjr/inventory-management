import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useUpdateManufacturerMutation, useGetManufacturersQuery } from "@/state/api";
import Header from "@/app/(components)/Header";

type EditManufacturerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  manufacturerId: string; 
};

const EditManufacturerModal = ({ isOpen, onClose, manufacturerId }: EditManufacturerModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    contact_info: "",
  });
  const [updateManufacturer] = useUpdateManufacturerMutation();
  const { data: manufacturers } = useGetManufacturersQuery();

  useEffect(() => {
    if (manufacturerId && manufacturers) {
      const manufacturer = manufacturers.find((m) => m.manufacturer_id === manufacturerId);
      if (manufacturer) {
        setFormData({
          name: manufacturer.name,
          country: manufacturer.country,
          contact_info: manufacturer.contact_info || "",
        });
      }
    }
  }, [manufacturerId, manufacturers]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (manufacturerId) {
      await updateManufacturer({ id: manufacturerId, data: formData });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Editar Marca" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* NAME */}
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* COUNTRY */}
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Pais
          </label>
          <input
            type="text"
            name="country"
            placeholder="Pais"
            onChange={handleChange}
            value={formData.country}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
            required
          />

          {/* CONTACT INFO */}
          <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700">
          Info de Contacto
          </label>
          <input
            type="text"
            name="contact_info"
            placeholder="Info de Contacto"
            onChange={handleChange}
            value={formData.contact_info}
            className="block w-full mb-2 p-2 border-gray-500 border-2 rounded-md"
          />

          {/* ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Save
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

export default EditManufacturerModal;
