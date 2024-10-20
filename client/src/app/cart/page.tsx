'use client';

import { useRouter, useSearchParams  } from 'next/navigation';
import { useGetVehicleSummaryByModelAndColorQuery, 
         VehicleModelSummary, 
         VehicleColor } from "@/state/api";
import { useEffect, useState } from 'react';

const CartPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const modelId = searchParams.get('modelId') || "";
  const color = searchParams.get('color');
  const quantity = searchParams.get('quantity');

  const [cartItems, setCartItems] = useState([]);

  const locationId = "2";
  const { data: models, isLoading, isError } = useGetVehicleSummaryByModelAndColorQuery({ locationId, modelId });
  const model = models && models.length > 0 ? models[0] : null;

  console.log('models:',models);

  useEffect(() => {
    if (modelId && quantity && color) {
      // Aquí puedes obtener el modelo y color usando el ID
      // Simularemos que añadimos el artículo al carrito
      const item = {
        modelId: modelId,
        quantity: Number(quantity),
        color: color,
        price: model?.basePrice, // Reemplaza esto con el precio real
      };
      setCartItems([item]);
    }
  }, [modelId, quantity, color]);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-4">Tu Carrito</h1>

      <div className="flex">
        {/* Tabla de productos */}
        <div className="w-2/3">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Producto</th>
                <th className="py-2">Precio</th>
                <th className="py-2">Cantidad</th>
                <th className="py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td className="py-2">{item.modelId}</td>
                  <td className="py-2">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.price)}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detalles de Tu Pedido */}
        <div className="w-1/3 pl-4">
          <h2 className="text-xl font-bold mb-2">Tu Pedido</h2>
          <div className="border p-4">
            <h3 className="text-lg font-semibold">Total: {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(total)}</h3>
            <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
              Proceder al Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
