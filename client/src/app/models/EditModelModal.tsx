import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Header from "@/app/(components)/Header";

type ModelFormData = {
  modelId: string;
  name: string;
  makeId: string; // Assuming you have a reference to Make
};

type EditModelModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (formData: ModelFormData) => void;
  initialData: ModelFormData;
};

const EditModelModal = ({ isOpen, onClose, onEdit, initialData }: EditModelModalProps) => {
  const [formData, setFormData] = useState<ModelFormData>(initialData);

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
        <Header name="Editar Modelo" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* MODEL NAME */}
          <label htmlFor="modelName" className={labelCssStyles}>
            Nombre de Modelo
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
          {/* MAKE ID */}
          <label htmlFor="makeId" className={labelCssStyles}>
            ID de Marca
          </label>
          <input
            type="text"
            name="makeId"
            placeholder="ID de Marca"
            onChange={handleChange}
            value={formData.makeId}
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

export default EditModelModal;