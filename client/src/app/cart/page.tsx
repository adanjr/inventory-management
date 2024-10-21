'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useGetVehicleSummaryByModelAndColorQuery, VehicleModelSummary, VehicleColor } from "@/state/api";
import Image from "next/image";
import { useEffect, useState } from 'react';

type CartItem = {
    modelId: string;
    quantity: number;
    color: string;
    price: number;
    vehicleType: string;
    modelName: string;
    colorName: string;
};

const CartPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const modelId = localStorage.getItem('modelId') || "";
    const colorId = localStorage.getItem('colorId') || "";
    const initialQuantity = Number(localStorage.getItem('quantity')) || 1;

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [quantity, setQuantity] = useState<number>(initialQuantity); // Estado para la cantidad

    const locationId = "2";
    const { data: models = [], isLoading, isError } = useGetVehicleSummaryByModelAndColorQuery({ locationId, modelId });

    const model = models.find((m) => m.modelId === Number(modelId));

    useEffect(() => {
        if (model && colorId) {
            const modelSelectedColor = model.colors.find(color => color.colorId === Number(colorId));
            const colorName = modelSelectedColor?.colorName ?? 'Color Desconocido';

            const item: CartItem = {
                modelId: modelId || '',
                quantity: quantity,
                color: colorId || '',
                price: model?.basePrice ?? 0,
                vehicleType: model?.vehicleType ?? 'Tipo Desconocido',
                modelName: model?.modelName ?? 'Modelo Desconocido',
                colorName: colorName,
                
            };
            setCartItems([item]);
        }
    }, [modelId, quantity, colorId, model]); // Incluye 'quantity' en las dependencias

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal;

    return (
        <div className="container mx-auto py-4">
            <h1 className="text-3xl font-bold mb-4">TU CARRITO</h1>

            <div className="flex">
                {/* Tabla de productos */}
                <div className="w-2/3">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 text-center text-lg font-extrabold text-gray-500"> </th>  
                                <th className="py-2 text-center text-lg font-extrabold text-gray-500">PRODUCTO</th>
                                <th className="py-2 text-center text-lg font-extrabold text-gray-500">PRECIO</th>
                                <th className="py-2 text-center text-lg font-extrabold text-gray-500">CANTIDAD</th>
                                <th className="py-2 text-center text-lg font-extrabold text-gray-500">SUBTOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-2 text-center">
                                       <Image 
                                            src={`https://s3-yaiiinventory.s3.us-east-2.amazonaws.com/${item.modelName}-${item.colorName}.jpg`}
                                            alt={`${item.modelName} ${item.colorName}`} 
                                            className="w-16 h-auto mx-auto" 
                                            width={128} // Define el ancho de la imagen
                                            height={128} // Define la altura de la imagen
                                        />
                                    </td>
                                    <td className="py-2 text-center">
                                      <span className="uppercase font-bold">{`${item.vehicleType} ${item.modelName} ${item.colorName}`}</span>
                                      <br /> {/* Salto de línea */}
                                      <span className="font-normal">Recibe tu E-bike armada y lista <br /> para las calles (gratis): <br />
                                      Armado y configurado (+$0.00)</span>
                                    </td>
                                    <td className="py-2 text-center">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.price)}</td>
                                    <td className="py-2 text-center">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            min="1"
                                            max={model?.colors.find(color => color.colorId === Number(colorId))?.count ?? 10} // Asegúrate de que este count exista
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                            className="w-16 text-center border rounded"
                                        />
                                    </td>
                                    <td className="py-2 text-center">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.price * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Detalles de Tu Pedido */}
                <div className="w-1/3 pl-4">
                  <div className="border p-4 bg-white">
                      <h2 className="text-2xl font-bold mb-4 text-center">TU PEDIDO</h2>
                      <div className="flex justify-between mb-2">
                          <h3 className="text-lg font-semibold">Subtotal:</h3>
                          <span className="text-lg">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(subtotal)}</span>
                      </div>
                      <hr className="my-4 border-gray-600" />
                      <div className="flex justify-between mb-6">
                          <h3 className="text-xl font-semibold">Total:</h3>
                          <span className="text-xl font-bold">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(total)}</span>
                      </div>
                      <button 
                       onClick={() => {
                        localStorage.setItem('modelId', modelId.toString());
                        localStorage.setItem('quantity', quantity.toString());
                        localStorage.setItem('colorId', colorId);
                        router.push('/checkout');  
                      }}
                      className="bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 w-full text-lg font-bold">
                          Proceder al Pago
                      </button>
                  </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
