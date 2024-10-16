import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Renombré v4 por uuidv4 para ser más explícito
import Header from "@/app/(components)/Header";

type ColorFormData = {
  colorId: string;
  name: string;
  hexadecimal: string;
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
    hexadecimal: "#000000",
  });

  // Manejar cambios en el input
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setFormData({
      ...formData,
      [name]: value, // Actualiza el color seleccionado en ambos inputs
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
      hexadecimal: formData.hexadecimal,
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
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* COLOR NAME */}
          <div className="flex flex-col">
            <label htmlFor="colorName" className={labelCssStyles}>
              Nombre de Color
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

          {/* COLOR PICKER Y HEXADECIMAL */}
          <div className="grid grid-cols-2 gap-4">
            {/* Color Picker */}
            <div className="flex flex-col">
              <label htmlFor="colorPicker" className={labelCssStyles}>
                Selecciona un color
              </label>
              <input
                type="color"
                id="colorPicker"
                name="hexadecimal"
                onChange={handleColorChange}
                value={formData.hexadecimal}
                className={inputCssStyles}
              />
            </div>

            {/* Input de texto para el valor hexadecimal */}
            <div className="flex flex-col">
              <label htmlFor="hexadecimal" className={labelCssStyles}>
                Hexadecimal
              </label>
              <input
                type="text"
                id="hexadecimal"
                name="hexadecimal"
                placeholder="Hexadecimal"
                onChange={handleColorChange}
                value={formData.hexadecimal}
                className={inputCssStyles}
                required
              />
            </div>
          </div>

          {/* ACCIONES (Botones) */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Crear
            </button>
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateColorModal;
