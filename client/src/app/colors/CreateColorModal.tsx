import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Renombré v4 por uuidv4 para ser más explícito
import Header from "@/app/(components)/Header";

type ColorFormData = {
  colorId: string;
  name: string;
};

type CreateColorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ColorFormData) => void;
};

const CreateColorModal = ({ isOpen, onClose, onCreate }: CreateColorModalProps) => {
  // Inicializar el estado con un ID único y un campo de nombre vacío
  const [formData, setFormData] = useState<ColorFormData>({
    colorId: uuidv4(),
    name: "",
  });

  // Manejar cambios en el input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);  // Enviar el color creado al callback `onCreate`
    
    // Actualizamos el estado para que el ID sea nuevo pero el nombre se mantenga
    setFormData({
      colorId: uuidv4(),
      name: formData.name, // Mantener el nombre después de la creación
    });

    onClose();  // Cerrar el modal
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles = "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Crear Nuevo Color" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* COLOR NAME */}
          <label htmlFor="colorName" className={labelCssStyles}>
            Nombre de Color
          </label>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            onChange={handleChange}
            value={formData.name} // Usar el valor actual del estado
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

export default CreateColorModal;
