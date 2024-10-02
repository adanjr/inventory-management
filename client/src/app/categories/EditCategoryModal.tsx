import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Header from "@/app/(components)/Header";
import { Category } from "@/state/api";

type CategoryFormData = {
  categoryId: string;
  name: string;
  description: string;
};

type EditCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (categoryId: string, formData: Partial<CategoryFormData>) => void;
  selectedCategory: Category | null;
};

const EditCategoryModal = ({
  isOpen,
  onClose,
  onEdit,
  selectedCategory,
}: EditCategoryModalProps) => {
  const [formData, setFormData] = useState({
    categoryId: selectedCategory?.categoryId || "",
    name: selectedCategory?.name || "",
    description: selectedCategory?.description || "",
  });

  useEffect(() => {
    if (selectedCategory && isOpen) {
      // Actualiza el formulario con los datos de la categoría seleccionada
      setFormData({
        categoryId: selectedCategory.categoryId,
        name: selectedCategory.name,
        description: selectedCategory.description,
      });
    }
  }, [selectedCategory, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onEdit(formData.categoryId, {
      name: formData.name,
      description: formData.description,
    });
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Editar Categoria" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* CATEGORY NAME */}
          <label htmlFor="categoryName" className={labelCssStyles}>
            Nombre de Categoria
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

          {/* DESCRIPTION */}
          <label htmlFor="categoryDescription" className={labelCssStyles}>
            Descripción
          </label>
          <input
            type="text"
            name="description"
            placeholder="Descripción"
            onChange={handleChange}
            value={formData.description}
            className={inputCssStyles}
            required
          />

          {/* EDIT ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Guardar Cambios
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

export default EditCategoryModal;
