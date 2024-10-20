"use client"; // Aseguramos que este componente se renderice del lado del cliente

import { useRouter, useSearchParams  } from 'next/navigation';
import { useGetVehicleSummaryByModelAndColorQuery, 
         VehicleModelSummary, 
         VehicleColor } from "@/state/api";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { BatteryCharging, Dumbbell, Gauge } from 'lucide-react';

const SalesDetails = () => {                     
  const router = useRouter();
  const searchParams = useSearchParams()
  const modelId = searchParams.get('modelId') || "";
  const colorId = searchParams.get('colorId');
  
  const locationId = "2";
  
  const { data: models, isLoading, isError } = useGetVehicleSummaryByModelAndColorQuery({ locationId, modelId });

  const model = models && models.length > 0 ? models[0] : null;

  const [selectedColors, setSelectedColors] = useState<{ [modelId: number]: VehicleColor }>({});
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1); // Estado para la cantidad

  useEffect(() => {
    if (model) {
      const initialColor = model.colors.find(color => color.colorId === Number(colorId));
      if (initialColor) {
        setSelectedColor(initialColor.colorId);
        setSelectedColors(prev => ({ ...prev, [model.modelId]: initialColor }));
      }
    }
  }, [model, colorId, modelId]);

  if (isLoading) {
    return <div className="py-4">Cargando...</div>;
  }

  if (isError || !model) {
    return (
      <div className="text-center text-red-500 py-4">
        Error al cargar el modelo
      </div>
    );
  }

  const selectedModel = model;
  let selectedColorObject: VehicleColor | undefined;

  if (selectedModel) {
    selectedColorObject = selectedModel.colors.find(color => color.colorId === selectedColor);
  }

  const handleColorSelect = (modelId: number, color: VehicleColor) => {
    setSelectedColors(prev => ({
      ...prev,
      [modelId]: color,
    }));
    setSelectedColor(color.colorId);
    setQuantity(1); // Resetear cantidad al seleccionar un nuevo color
  };

  const incrementQuantity = () => {
    if (quantity < (selectedColorObject?.count || 1)) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="mx-auto pb-5 w-full">
      <div className="border shadow rounded-md p-4 max-w-full w-full mx-auto flex relative">
        {/* Left Section: Larger Image - 70% width */}
        <div className="w-full flex justify-center items-center relative" style={{ height: "70vh", flex: '0 0 70%' }}>
          <Image
            src={`https://s3-yaiiinventory.s3.us-east-2.amazonaws.com/${model.modelName}-${selectedColors[model.modelId]?.colorName}.jpg`}
            alt={model.modelName}
            fill
            className="rounded-2xl object-cover"
            style={{ objectFit: 'cover' }} // Asegura que la imagen no se distorsione
          />
        </div>

        {/* Right Section: Details - 30% width */}
        <div className="w-full flex flex-col justify-between px-4 h-full" style={{ flex: '0 0 30%' }}>
          {/* Model Name */}
          <div>
            <h3 className="text-2xl text-gray-900 font-bold">{model.vehicleType} {model.modelName}</h3>
          </div>

          {/* Battery Duration */}
          <div className="mt-2 border p-3 rounded-lg flex items-center space-x-3 bg-gray-100">
            <BatteryCharging className="w-6 h-6 text-gray-700" />
            <div>
              <p className="text-sm text-gray-700 font-medium">Duración de batería</p>
              <p className="text-md text-gray-900">
                {model.range ? `${model.range} kWh` : "N/A"}
              </p>
            </div>
          </div>

          {/* Weight Capacity */}
          <div className="mt-2 border p-3 rounded-lg flex items-center space-x-3 bg-gray-100">
            <Dumbbell className="w-6 h-6 text-gray-700" />
            <div>
              <p className="text-sm text-gray-700 font-medium">Capacidad de peso</p>
              <p className="text-md text-gray-900">
                {model.weightCapacity ? `${model.weightCapacity} kg` : "N/A"}
              </p>
            </div>
          </div>

          {/* Speed */}
          <div className="mt-2 border p-3 rounded-lg flex items-center space-x-3 bg-gray-100">
            <Gauge className="w-6 h-6 text-gray-700" />
            <div>
              <p className="text-sm text-gray-700 font-medium">Velocidad máxima</p>
              <p className="text-md text-gray-900">
                {model.speed ? `${model.speed} km/h` : "N/A"}
              </p>
            </div>
          </div>

          {/* Colors Section */}
          <div className="mt-2">
            <h4 className="text-md text-gray-700 font-medium">Colores disponibles:</h4>
            <div className="flex space-x-2 mt-2">
              {model.colors.map((color) => {
                const isSelected = selectedColors[model.modelId]?.colorId === color.colorId;
                return (
                  <div
                    key={color.colorId}
                    className={`w-8 h-8 rounded-full cursor-pointer border border-gray-300 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                    style={{ backgroundColor: color.hexadecimal }}
                    title={color.colorName}
                    onClick={() => handleColorSelect(model.modelId, color)}
                  />
                );
              })}
            </div>
          </div>

          {/* Quantity Section */}
          <div className="mt-4">
            {/* Grand Total arriba del input */}
            <div className="flex justify-center mb-4">
              <span className="text-xl font-medium mr-2">Grand Total:</span>
              <span className="text-2xl font-bold">
                {new Intl.NumberFormat('es-MX', {
                  style: 'currency',
                  currency: 'MXN',
                }).format(model.basePrice * quantity)}
              </span>
            </div>

            {/* Input numérico y botón en la misma línea */}
            <div className="flex items-center mb-4">
              <input 
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.min(Math.max(1, Number(e.target.value)), model.count))} 
                min={1} 
                max={selectedColorObject?.count}
                className="border text-center w-24 h-12 text-xl mr-2 px-2 rounded-lg"  // Ajusta tamaño
              />
              <button 
                onClick={() => {
                  router.push(`/cart?modelId=${modelId}&quantity=${quantity}&color=${selectedColorObject?.colorId}`);
                }} 
                className="bg-green-500 text-white py-4 px-10 rounded-lg text-2xl font-bold hover:bg-green-600"
              >
                Comprar
              </button>
            </div>

            {/* Precio en grande */}
            <div className="flex justify-center">
              <h1 className="text-3xl text-gray-900 font-bold">
                {new Intl.NumberFormat('es-MX', {
                  style: 'currency',
                  currency: 'MXN',
                }).format(model.basePrice)}
              </h1>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SalesDetails;
