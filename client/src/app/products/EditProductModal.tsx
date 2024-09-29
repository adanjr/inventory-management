import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useGetCategoriesQuery, useUpdateProductMutation } from "@/state/api"; // Importar la mutación de actualización y categorías
import Header from "@/app/(components)/Header";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
  categoryId: string; // Add category to the product form data
};

type UpdateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: ProductFormData | null; // Product to update
  onUpdate: (id: string, formData: ProductFormData) => void;
};

const EditProductModal = ({ isOpen, onClose, product, onUpdate }: UpdateProductModalProps) => {
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategoriesQuery(); // Obtener categorías
  const [updateProduct] = useUpdateProductMutation(); // Usar la mutación de actualización

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    stockQuantity: 0,
    rating: 0,
    categoryId: "",
  });

  // Cargar datos del producto cuando el modal se abra
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        stockQuantity: product.stockQuantity,
        rating: product.rating,
        categoryId: product.categoryId,
      });
    }
  }, [product]);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (product) {
      await updateProduct({ id: product.productId, data: formData }); // Llamar a la mutación de actualización
      onUpdate(product.productId, formData); // Ejecutar función onUpdate después de la actualización
      onClose();
    }
  };

  if (!isOpen || !product) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles = "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Actualizar Producto" />
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

          {/* UPDATE ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Actualizar
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

export default EditProductModal;