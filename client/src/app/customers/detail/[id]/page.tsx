"use client";

import { useEffect, useState } from "react";
import { useGetCustomerByIdQuery } from "@/state/api";
import { useRouter } from 'next/navigation';

const DetailCustomer = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const id = params.id;
  const { data: customer, isLoading: customerLoading } = useGetCustomerByIdQuery(id); // Fetch customer data

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",    
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name!,
        lastname: customer.lastname!,
        email: customer.email,
        phone: customer.phone!,
        address: customer.address!,
        city: customer.city!,
        state: customer.state!,
        country: customer.country!,
        postalCode: customer.postalCode!,         
      });
    }
  }, [customer]);

  const handleBack = () => {
    router.push("/customers"); // Redirigir a la lista de clientes
  };

  if (customerLoading) {
    return <p>Cargando cliente...</p>; // Loading message
  }

  return (
    <div className="mx-auto p-6 max-w-6xl bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Detalles del Cliente</h2>
      
      <form>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          {/* Campos de solo lectura */}
          
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
            <label className="block text-gray-700 font-semibold">Apellidos</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>  

          <div>
            <label className="block text-gray-700 font-semibold">Teléfono</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>            

          <div>
            <label className="block text-gray-700 font-semibold">Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>          
          
          <div>
            <label className="block text-gray-700 font-semibold">Ciudad</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Estado</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">País</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            />            
          </div>

          <div>
              <label className="block text-gray-700 font-semibold">Código Postal</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                disabled
                className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
              />               
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button 
            type="button" 
            onClick={handleBack} 
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Regresar a Clientes
          </button>
        </div>
      </form>
    </div>
  );
};

export default DetailCustomer;
