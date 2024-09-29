import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";
import { useGetCategoriesQuery } from "@/state/api"; 

type ProductFormData = {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  rating: number;
  categoryId: string;
  isSerialized: boolean;  
};

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ProductFormData) => void;
};

const CreateProductModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateProductModalProps) => {
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategoriesQuery(); // Fetch categories

  const [formData, setFormData] = useState({
    productId: v4(),
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    rating: 0,
    categoryId: "",
    isSerialized: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "price" || name === "stockQuantity" || name === "rating"
          ? parseFloat(value)
          : value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Crear Nuevo Producto" />
        <form onSubmit={handleSubmit} className="mt-5">

          {/* CATEGORY SELECTION */}
          <label htmlFor="category" className={labelCssStyles}>
            Categoría
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className={inputCssStyles}
            required
          >
            <option value="" disabled>
              {isCategoriesLoading ? "Cargando categorías..." : "Selecciona una categoría"}
            </option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* PRODUCT NAME */}
          <label htmlFor="productName" className={labelCssStyles}>
            Nombre de Producto
          </label>
          <input
            type="text"
            name="name"
            placeholder="Nombre de Producto"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          />

          {/* DESCRIPTION */}
          <label htmlFor="description" className={labelCssStyles}>
            Nombre de Producto
          </label>
          <input
            type="text"
            name="description"
            placeholder="Descripcion"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          />

          {/* PRICE */}
          <label htmlFor="productPrice" className={labelCssStyles}>
            Precio
          </label>
          <input
            type="number"
            name="price"
            placeholder="Precio"
            onChange={handleChange}
            value={formData.price}
            className={inputCssStyles}
            required
          />

          {/* STOCK QUANTITY */}
          <label htmlFor="stockQuantity" className={labelCssStyles}>
          Cantidad en Stock
          </label>
          <input
            type="number"
            name="stockQuantity"
            placeholder="Cantidad en Stock"
            onChange={handleChange}
            value={formData.stockQuantity}
            className={inputCssStyles}
            required
          />

         {/* IS SERIALIZED */}
          <label htmlFor="isSerialized" className={labelCssStyles}>
            Serializado
          </label>
          <input
            type="checkbox"
            name="isSerialized"
            onChange={handleChange}
            checked={formData.isSerialized} // This should be a boolean value
            className={inputCssStyles}
          />

          {/* RATING */}
          <label htmlFor="rating" className={labelCssStyles}>
            Rating
          </label>
          <input
            type="number"
            name="rating"
            placeholder="Rating"
            onChange={handleChange}
            value={formData.rating}
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
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
