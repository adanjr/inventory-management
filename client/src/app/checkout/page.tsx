'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useGetVehicleSummaryByModelAndColorQuery,
         useGenerateSendPdfMutation, 
         VehicleModelSummary, 
         VehicleColor,
         useCreateSaleMutation } from "@/state/api";
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

type CartItem = {
    modelId: string;
    quantity: number;
    color: string;
    price: number;
    vehicleType: string;
    modelName: string;
    colorName: string;
};

const CheckoutPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const modelId = localStorage.getItem('modelId') || "";
    const colorId = localStorage.getItem('colorId') || "";
    const initialQuantity = Number(localStorage.getItem('quantity')) || 1;

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [quantity, setQuantity] = useState<number>(initialQuantity);
    const [paymentMethod, setPaymentMethod] = useState<string>('');

    const locationId = "2";
    const { data: models = [], isLoading, isError } = useGetVehicleSummaryByModelAndColorQuery({ locationId, modelId });

    const model = models.find((m) => m.modelId === Number(modelId));

    const [createSale] = useCreateSaleMutation();

    const id = '';

    const [generateSendPdf, { data: sendPdfResponse, error: sendPdfError }] = useGenerateSendPdfMutation(); 
    
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

    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    }

    function handlePaymentChange(event: ChangeEvent<HTMLInputElement>): void {
        setPaymentMethod(event.target.value);
    }

    async function handlePayment() {

        // Validar que se han ingresado todos los datos obligatorios del cliente
        const { name, lastname, email } = formData;
        if (!name || !lastname || !email) {
            alert("Por favor, completa todos los campos obligatorios del cliente (Nombre, Apellidos y Email).");
            return;
        }

        // Validar que haya seleccionado un método de pago
        if (!paymentMethod) {
            alert("Por favor, selecciona un método de pago.");
            return;
        }

        try {
            // Datos para crear la venta
            const newSale = {
                saleId: 0,  // Esto puede generarlo el backend
                timestamp: new Date().toISOString(),
                quantity: quantity,
                unitPrice: cartItems[0].price,
                totalAmount: total,
                customerId: 0,  // Supongamos que no tienes un customerId aún
                paymentMethod: paymentMethod,
                enviarADomicilio: false,  // Según la lógica que tengas
                recogerEnTieda: true,     // Según la lógica que tengas
                compraOnline: true,       // Según la lógica que tengas
                locationId: Number(locationId),
                saleDetails: cartItems.map(item => ({
                    saleDetailId: 0,  // Esto también lo puede generar el backend
                    modelId: Number(item.modelId),
                    colorId: Number(item.color),
                    isVehicle: true,
                    vehicleId: null,  // Si aplica
                    quantity: item.quantity,
                    unitPrice: item.price,
                    subtotal: item.price * item.quantity,
                    assemblyAndConfigurationCost: 0,  // Ajustar según sea necesario
                })),
                customerData: {
                    ...formData,
                }
            };

            // Llamar a la mutación para crear la venta
            const saleResponse = await createSale(newSale);

            if (saleResponse.data?.saleId) {                
                alert("Venta creada exitosamente");
                await generateSendPdf(saleResponse.data.saleId.toString()); 
                router.push(`/salesOrders/details?Id=${saleResponse.data.saleId}`); // Usa el ID recuperado aquí
            } else {
                alert("No se pudo recuperar el ID de la venta.");
            }
  
        } catch (error) {
            console.error("Error creando la venta:", error);
            alert("Hubo un error al crear la venta.");
        }
    }

    return (
    <div className="container mx-auto py-4">    
        <div className="flex">
            {/* Sección izquierda para Datos del Cliente */}
            <div className="w-2/3 pr-4">
                {/* Aquí puedes agregar los campos de datos del cliente */}
                <div className="border p-4 bg-white mb-4">
                    <h2 className="text-2xl font-bold mb-4">DATOS DEL CLIENTE</h2>
                    <form className="space-y-4">
                        {/* Row 1: Nombre y Apellidos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                NOMBRE
                            </label>
                            <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="NOMBRE"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="border w-full p-2 mb-2 rounded"
                                        required
                                    />
                            </div>
                            <div>
                            <label
                                htmlFor="lastname"
                                className="block text-sm font-medium text-gray-700"
                            >
                                APELLIDOS
                            </label>
                            <input
                                        type="text"
                                        id="lastname"
                                        name="lastname"
                                        placeholder="APELLIDOS"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        className="border w-full p-2 mb-2 rounded"
                                        required
                                    />
                            </div>
                        </div>

                        {/* Row 2: Código Postal */}
                        <div>
                            <label
                            htmlFor="postalCode"
                            className="block text-sm font-medium text-gray-700"
                            >
                            CODIGO POSTAL
                            </label>
                            <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    placeholder="CODIGO POSTAL"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    className="border w-full p-2 mb-2 rounded"
                                />
                        </div>

                        {/* Row 3: Teléfono */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            TELEFONO
                            </label>
                            <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    placeholder="TELEFONO"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="border w-full p-2 mb-2 rounded"
                                />
                        </div>

                        {/* Row 4: Correo Electrónico */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            EMAIL
                            </label>
                            <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="EMAIL"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="border w-full p-2 mb-2 rounded"
                                    required
                                />
                        </div>

                        {/* Row 5: Dirección */}
                        <div>
                            <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700"
                            > 
                            CALLE Y NUMERO
                            </label>
                            <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    placeholder="CALLE Y NUMERO"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="border w-full p-2 mb-2 rounded"
                                />
                        </div>

                        {/* Row 6: Ciudad */}
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            CIUDAD
                            </label>
                            <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    placeholder="CIUDAD"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="border w-full p-2 mb-2 rounded"
                                />
                        </div>

                        {/* Row 7: Estado */}
                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                            ESTADO
                            </label>
                            <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    placeholder="ESTADO"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="border w-full p-2 mb-2 rounded"
                                />
                        </div>

                        {/* Row 8: País */}
                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                            PAIS
                            </label>
                            <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    placeholder="PAIS"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="border w-full p-2 mb-2 rounded"
                                />
                        </div>
                    </form>
                </div>
            </div>

        {/* Detalles de Tu Pedido */}
        <div className="w-1/3 pl-4">
            {/* Resumen del pedido */}
            <div className="border p-4 bg-white mb-4">
                <h2 className="text-2xl font-bold mb-4 text-center">RESUMEN DE TU PEDIDO</h2>

                {/* Producto y Subtotal */}
                {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between mb-2">
                        <span>
                            <span className="uppercase font-bold">{`${item.vehicleType} ${item.modelName} ${item.colorName}`}</span>
                            <br />
                            <span className="font-normal">
                                Recibe tu E-bike armada y lista <br /> para las calles (gratis): <br />
                                Armado y configurado (+$0.00)
                            </span>
                        </span>
                        <span className="text-lg">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.price * item.quantity)}</span>
                    </div>
                ))}

                <hr className="my-4 border-gray-600" />
                <div className="flex justify-between mb-6">
                    <h3 className="text-xl font-semibold">Subtotal:</h3>
                    <span className="text-xl font-bold">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(subtotal)}</span>
                </div>
                <div className="flex justify-between mb-6">
                    <h3 className="text-xl font-semibold">Total:</h3>
                    <span className="text-xl font-bold">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(total)}</span>
                </div>
            </div>

            {/* Método de pago */}
            <div className="border p-4 bg-white">
                <h2 className="text-2xl font-bold mb-4 text-center">MÉTODO DE PAGO</h2>
                
                {/* Opciones de método de pago */}
                <div className="flex flex-col space-y-4">
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="EFECTIVO" 
                            className="mr-2" 
                            onChange={handlePaymentChange} 
                            required 
                        />
                        Pago en Efectivo
                    </label>
                    <label className="flex items-center">
                        <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="TARJETA" 
                            className="mr-2" 
                            onChange={handlePaymentChange} 
                        />
                        Tarjeta de Crédito/Débito
                    </label>                     
                </div>

                {/* Botón para proceder al pago */}
                <button 
                onClick={handlePayment}
                className="bg-blue-500 text-white py-3 px-4 mt-6 rounded hover:bg-blue-600 w-full text-lg font-bold">
                    Proceder al Pago
                </button>
            </div>
        </div>
        </div>
    </div>

    );
};

export default CheckoutPage;
