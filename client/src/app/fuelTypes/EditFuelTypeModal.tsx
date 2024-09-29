import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Header from "@/app/(components)/Header";

type FuelTypeFormData = {
  fuelTypeId: string;
  name: string;
};

type EditFuelTypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (formData: FuelTypeFormData) => void;
  initialData: FuelTypeFormData;
};

const EditFuelTypeModal = ({ isOpen, onClose, onEdit, initialData }: EditFuelTypeModalProps) => {
  const [formData, setFormData] = useState<FuelTypeFormData>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onEdit(formData);
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Editar Tipo de Combustible" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* FUEL TYPE NAME */}
          <label htmlFor="fuelTypeName" className={labelCssStyles}>
            Nombre de Tipo de Combustible
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
          {/* EDIT ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Editar
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

export default EditFuelTypeModal;