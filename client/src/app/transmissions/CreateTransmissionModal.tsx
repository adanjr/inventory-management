import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid"; // Esto se puede eliminar si no lo necesitas
import Header from "@/app/(components)/Header";

type TransmissionFormData = {
  type: string; // Cambiar a 'type'
};

type CreateTransmissionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: TransmissionFormData) => void;
};

const CreateTransmissionModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateTransmissionModalProps) => {
  const [formData, setFormData] = useState<TransmissionFormData>({
    type: "", // Solo el campo 'type'
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
    onCreate(formData); // Aquí envías solo el tipo
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Crear Nueva Transmisión" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* TRANSMISSION TYPE */}
          <label htmlFor="transmissionType" className={labelCssStyles}>
            Tipo de Transmisión
          </label>
          <input
            type="text"
            name="type" // Cambiar a 'type'
            placeholder="Tipo"
            onChange={handleChange}
            value={formData.type}
            className={inputCssStyles}
            required
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

export default CreateTransmissionModal;
