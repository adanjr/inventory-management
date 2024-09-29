import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Header from "@/app/(components)/Header";

type CategoryFormData = {
  category_id: string;
  name: string;
  description: string;
  phone: string;
  address: string;
  postal_code: string;
  city: string;
  state: string;
  country: string;
};

type EditCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categoryData: CategoryFormData;
  onEdit: (formData: CategoryFormData) => void;
};

const EditCategoryModal = ({
  isOpen,
  onClose,
  categoryData,
  onEdit,
}: EditCategoryModalProps) => {
  const [formData, setFormData] = useState<CategoryFormData>(categoryData);

  useEffect(() => {
    if (categoryData) {
      setFormData(categoryData); // Cuando los datos cambian, actualizamos el formulario
    }
  }, [categoryData]);

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
          Descripcion
          </label>
          <input
            type="description"
            name="description"
            placeholder="Descripcion"
            onChange={handleChange}
            value={formData.description}
            className={inputCssStyles}
            required
          />


          {/* EDIT ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
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
