"use client";

import { useEffect, useState } from "react";
import { 
  useGetProductByIdQuery, 
  useGetCategoriesQuery,  
  useGetManufacturersQuery,  
} from "@/state/api";
import { useRouter } from 'next/navigation';

const ViewProduct = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const id = params.id;
  const { data: product, isLoading: productLoading } = useGetProductByIdQuery(id); 

  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();     
  const { data: manufacturers, isLoading: manufacturersLoading } = useGetManufacturersQuery();  

  const [formData, setFormData] = useState({
    name: "",
    productCode: "",
    description: "",
    price: 0,
    reorderQuantity: 0,
    rating: 0,
    categoryId: "",
    manufacturerId: "",        
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name!,
        productCode: product.productCode!,
        description: product.description!,
        rating: product.rating!,
        price: product.price,         
        reorderQuantity: product.reorderQuantity!,
        categoryId: product.categoryId,
        manufacturerId: product.manufacturerId,         
      });     
    }
  }, [product]);

  if (productLoading) {
    return <p>Cargando producto...</p>; // Loading message
  }

  const handleBack = () => {
    router.push("/products"); // Redirigir a la lista de productos
  };

  return (
    <div className="mx-auto p-6 max-w-6xl bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Ver Producto</h2>
      
      <form>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          {/* Campos del formulario en solo lectura */}
          <div>
            <label className="block text-gray-700 font-semibold">Categoria</label>
            {categoriesLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="categoryId"
                value={formData.categoryId}
                disabled
                className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
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
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Codigo de Producto</label>
            <input
              type="text"
              name="productCode"
              value={formData.productCode}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
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
                disabled
                className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
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
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Cantidad para Reordenar</label>
            <input
              type="number"
              name="reorderQuantity"
              value={formData.reorderQuantity}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
              rows={4}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end mt-6">
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

export default ViewProduct;
