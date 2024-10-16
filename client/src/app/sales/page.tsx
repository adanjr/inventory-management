"use client";

import { useGetVehicleSummaryByModelAndColorQuery } from "@/state/api";
import { useState } from "react";
import { BatteryCharging, Gauge, Dumbbell } from "lucide-react"; 
import Header from "@/app/(components)/Header";
import Image from "next/image";

const ModelsPage = () => {
  const [locationId, setLocationId] = useState(2); // Suponiendo que tienes un locationId

  // Llamada al hook con el locationId
  const { data: models, isLoading, isError } = useGetVehicleSummaryByModelAndColorQuery(locationId.toString());

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
      className="border shadow rounded-md p-4 max-w-full w-full mx-auto flex"
      style={{ height: "400px" }} // Ajusta la altura del contenedor
    >
      {/* Left Section: Larger Image - 75% width */}
      <div className="w-2/3 flex justify-center items-center">
        <Image
          src="https://s3-yaiiinventory.s3.us-east-2.amazonaws.com/AJ2000.jpg" // Imagen fija
          alt={model.modelName}
          width={300}
          height={300}
          className="rounded-2xl w-full h-full object-cover" // Imagen estirada
        />
      </div>

      {/* Right Section: Details - 25% width */}
      <div className="w-1/3 flex flex-col justify-between px-4">
  {/* Model Name */}
  <div>
    <h3 className="text-2xl text-gray-900 font-bold">{model.vehicleType} {model.modelName}</h3>
  </div>

  {/* Battery Duration */}
  <div className="mt-2 border p-3 rounded-lg flex items-center space-x-3 bg-gray-100">
    {/* Icono de batería a la izquierda */}
    <BatteryCharging className="w-6 h-6 text-gray-700" />
    
    {/* Información de la duración de la batería */}
    <div>
      <p className="text-sm text-gray-700 font-medium">Duración de batería</p>
      <p className="text-md text-gray-900">
        {model.range ? `${model.range} kWh` : "N/A"}
      </p>
    </div>
  </div>

  {/* Weight Capacity */}
  <div className="mt-2 border p-3 rounded-lg flex items-center space-x-3 bg-gray-100">
    {/* Icono de pesa a la izquierda */}
    <Dumbbell className="w-6 h-6 text-gray-700" />
    
    {/* Información de la capacidad de peso */}
    <div>
      <p className="text-sm text-gray-700 font-medium">Capacidad de peso</p>
      <p className="text-md text-gray-900">
        {model.weightCapacity ? `${model.weightCapacity} kg` : "N/A"}
      </p>
    </div>
  </div>

  {/* Speed */}
  <div className="mt-2 border p-3 rounded-lg flex items-center space-x-3 bg-gray-100">
    {/* Icono de acelerómetro a la izquierda */}
    <Gauge className="w-6 h-6 text-gray-700" />
    
    {/* Información de la velocidad máxima */}
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
      return (
        <div
            key={color.colorId}
            className="w-6 h-6 rounded-full border border-gray-300"
            style={{ backgroundColor: color.hexadecimal }} // Usar el valor hexadecimal del color
            title={color.colorName} // Puedes mostrar el nombre del color como título o usar un nombre en español si lo tienes
          />

      );
    })}
  </div>
</div>

  {/* Choose Button */}
  <div className="mt-4">
    <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600">
      ELEGIR
    </button>
  </div>
</div>

    </div>
  ))}
</div>


    </div>
  );
};

export default ModelsPage;
