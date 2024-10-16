import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Header from "@/app/(components)/Header";
import { Color } from "@/state/api";

type ColorFormData = {
  colorId: string;
  name: string;
  hexadecimal: string;
};

type EditColorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (colorId: string, formData: Partial<ColorFormData>) => void;
  selectedColor: Color | null;
};

const EditColorModal = ({
  isOpen,
  onClose,
  onEdit,
  selectedColor,
}: EditColorModalProps) => {
  const [formData, setFormData] = useState({
    colorId: selectedColor?.colorId || "",
    name: selectedColor?.name || "",   
    hexadecimal: selectedColor?.hexadecimal || "",   
  });

  useEffect(() => {
    if (selectedColor && isOpen) {
      // Actualiza el formulario con los datos del color seleccionado
      setFormData({
        colorId: selectedColor.colorId,
        name: selectedColor.name, 
        hexadecimal: selectedColor.hexadecimal, 
      });
    }
  }, [selectedColor, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejar el cambio en el picker de color
  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      hexadecimal: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onEdit(formData.colorId, {
      name: formData.name,   
      hexadecimal: formData.hexadecimal,      
    });
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles = "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Editar Color" />
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
            value={formData.name}
            className={inputCssStyles}
            required
          />
          
          {/* COLOR PICKER */}
          <div className="flex flex-col mt-2">
            <label htmlFor="colorPicker" className={labelCssStyles}>
              Selecciona un color
            </label>
            <input
              type="color"
              id="colorPicker"
              name="hexadecimal"
              onChange={handleColorChange}
              value={formData.hexadecimal}
              className={`${inputCssStyles} w-12 h-8`} // Tamaño ajustado
            />
          </div>

          {/* Input de texto para el valor hexadecimal */}
          <label htmlFor="hexadecimal" className={labelCssStyles}>
            Hexadecimal
          </label>
          <input
            type="text"
            id="hexadecimal"
            name="hexadecimal"
            placeholder="Hexadecimal"
            onChange={handleChange} // Permite editar manualmente el valor hexadecimal
            value={formData.hexadecimal}
            className={inputCssStyles}
            required
          />

          {/* EDIT ACTIONS */}
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Editar
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

export default EditColorModal;
