"use client";

import { useState, useEffect } from "react";
import { 
  useCreateProductMutation,
  useGetCategoriesQuery,  
  useGetManufacturersQuery,  
} from "@/state/api";
import { useRouter } from "next/navigation";

const CreateProduct = () => {
  const router = useRouter();
  const [createProduct] = useCreateProductMutation();  

  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: manufacturers, isLoading: manufacturersLoading } = useGetManufacturersQuery();

  const [formData, setFormData] = useState({
    name: "",
    productCode: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    reorderQuantity: 0,
    rating: 0,
    categoryId: "",
    manufacturerId: "",
    locationId: "",
    isSerialized: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" 
        ? Number(value) 
        : type === "checkbox" 
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProduct(formData);
    router.push("/products"); 
  };

  const handleBack = () => {
    router.push("/products");  
  };

  return (
    <div className="mx-auto p-6 max-w-6xl bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Agregar Nuevo Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">  
        <div>
            <label className="block text-gray-700 font-semibold">Categoria</label>
            {categoriesLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione una categoria</option>
                {categories?.map((category: any) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
        </div>  

          <div>
            <label className="block text-gray-700 font-semibold">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>
         
          <div>
            <label className="block text-gray-700 font-semibold">Codigo de Producto</label>
            <input
              type="text"
              name="productCode"
              value={formData.productCode}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Marca</label>
            {manufacturersLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="manufacturerId"
                value={formData.manufacturerId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione una marca</option>
                {manufacturers?.map((manufacturer: any) => (
                  <option key={manufacturer.manufacturerId} value={manufacturer.manufacturerId}>
                    {manufacturer.name}
                  </option>
                ))}
              </select>
            )}
        </div>  
          
          <div>
            <label className="block text-gray-700 font-semibold">Precio (MXN)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Cantidad para Reordenar</label>
            <input
              type="number"
              name="reorderQuantity"
              value={formData.reorderQuantity}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              rows={4}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Guardar Producto
          </button>
          <button 
            type="button" 
            onClick={handleBack} 
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Regresar a Productos
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
