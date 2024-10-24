"use client";

import { useGetVehicleSummaryByModelAndColorQuery,  
         VehicleModelSummary, 
         VehicleColor,
         useGetLocationsQuery,                 
          } from "@/state/api";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { BatteryCharging, Gauge, Dumbbell } from "lucide-react"; 
import Header from "@/app/(components)/Header";
import Image from "next/image";

interface Color {
  colorId: number;
  colorName: string;
  hexadecimal: string;
}

const ModelsPage = () => {
  const router = useRouter();
  
  const { data: locations= [] } = useGetLocationsQuery();
  const sucursal = locations.find(l=>l.type === 'Sucursal');
  const [locationId, setLocationId] = useState('0');
  const { data: models= [], isLoading, isError } = useGetVehicleSummaryByModelAndColorQuery({locationId});

  // Estado para manejar el color seleccionado por modelo
  const [selectedColors, setSelectedColors] = useState<{ [modelId: number]: VehicleColor }>({});

  useEffect(() => {
    if (sucursal) {
      setLocationId(sucursal.locationId.toString());
    }
  }, [sucursal]);

  useEffect(() => {
    if (models.length > 0) {
      const initialColors: { [modelId: number]: VehicleColor } = {}; // Definición de tipo
      models.forEach(model => {
        if (model.colors.length > 0) {
          initialColors[model.modelId] = model.colors[0]; // Selecciona el primer color
        }
      });
      setSelectedColors(initialColors);
    }
  }, [models]);

  const handleColorSelect = (modelId: number, color: VehicleColor) => {
    setSelectedColors(prev => ({
      ...prev,
      [modelId]: color,
    }));
  };

  if (isLoading) {
    return <div className="py-4">Cargando...</div>;
  }

  if (isError || !models) {
    return (
      <div className="text-center text-red-500 py-4">
        Error al cargar los modelos
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Elige el modelo a vender" />
      </div>

      {/* BODY MODELS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-between">
        {models?.map((model) => (
          <div
            key={model.modelId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto flex relative" // Habilitar posición relativa
            style={{ height: "400px" }} // Ajusta la altura del contenedor
          >
            {/* Left Section: Larger Image - 75% width */}
            <div className="w-2/3 flex justify-center items-center relative"> {/* Habilitar posición relativa para la imagen */}
              <Image
                src={`https://s3-yaiiinventory.s3.us-east-2.amazonaws.com/${model.modelName}-${selectedColors[model.modelId]?.colorName}.jpg`}
                alt={model.modelName}
                width={300}
                height={300}
                className="rounded-2xl w-full h-full object-cover" // Imagen estirada
              />
              {/* Botón ELEGIR sobre la imagen */}
              <button 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 z-10"
              onClick={() => {
                localStorage.setItem('modelId', model.modelId.toString());
                localStorage.setItem('colorId', selectedColors[model.modelId]?.colorId.toString());
                router.push('/sales/salesDetails');
              }}
              >
                ELEGIR
              </button>
            </div>

            {/* Right Section: Details - 25% width */}
            <div className="w-1/3 flex flex-col justify-between px-4">
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
                    const isSelected = selectedColors[model.modelId]?.colorId === color.colorId; // Verificar si es el color seleccionado
                    return (
                      <div
                        key={color.colorId}
                        className={`w-8 h-8 rounded-full cursor-pointer border border-gray-300 ${isSelected ? 'ring-2 ring-blue-500' : ''}`} // Resaltar color seleccionado
                        style={{ backgroundColor: `${color.hexadecimal}` }}
                        title={color.colorName} // Mostrar el nombre del color
                        onClick={() => handleColorSelect(model.modelId, color)} // Manejar el clic
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelsPage;
