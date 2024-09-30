"use client";

import { useState } from "react";
import { 
  useCreateVehicleMutation,
  useGetVehicleTypesQuery,
  useGetMakesQuery,
  useGetModelsQuery,
  useGetColorsQuery,
  useGetEngineTypesQuery,
  useGetTransmissionsQuery,
  useGetFuelTypesQuery,
  useGetVehicleStatusesQuery,
} from "@/state/api";
import { useRouter } from "next/navigation";

const CreateVehicle = () => {
  const router = useRouter();
  const [createVehicle] = useCreateVehicleMutation();

  const { data: vehicleTypes, isLoading: vehicleTypesLoading } = useGetVehicleTypesQuery();
  const { data: makes, isLoading: makesLoading } = useGetMakesQuery();
  const { data: models, isLoading: modelsLoading } = useGetModelsQuery();
  const { data: colors, isLoading: colorsLoading } = useGetColorsQuery();
  const { data: engineTypes, isLoading: engineTypesLoading } = useGetEngineTypesQuery();
  const { data: fueltypes, isLoading: fueltypesLoading } = useGetFuelTypesQuery();
  const { data: vehicleStatuses, isLoading: vehicleStatusesLoading } = useGetVehicleStatusesQuery();
  const { data: transmissions, isLoading: transmissionsLoading } = useGetTransmissionsQuery();

  const [formData, setFormData] = useState({
    vin: "",
    internal_serial: "",
    vehicleTypeId: 0,
    makeId: 0,
    modelId: 0,
    year: 2024,
    colorId: 0,
    engineTypeId: 0,
    fuelTypeId: 0,
    transmissionId: 0,
    statusId: 0,
    mileage: 0,
    batteryCapacity: 0,
    range: 0,
    wheelCount: 2,
    price: 0,
    stockNumber: "",
    barcode: "",
    qrCode: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    // Convierte a número si el campo es un ID
    const isIdField = [
      "vehicleTypeId",
      "makeId",
      "modelId",
      "colorId",
      "engineTypeId",
      "fuelTypeId",
      "transmissionId",
      "statusId",
      "mileage",  // Si también quieres que sea un número
      "batteryCapacity",
      "range",
      "wheelCount",
      "price",
      "year",
    ].includes(name);
  
    setFormData((prev) => ({
      ...prev,
      [name]: isIdField ? parseInt(value) : value, // Mantener como cadena, la conversión se hará al enviar
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createVehicle(formData);
    router.push("/vehicles"); // Redirige a la lista de vehículos después de crear uno nuevo
  };

  return (
    <div className="mx-auto p-6 max-w-6xl bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Agregar Nuevo Vehículo</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          <div>
            <label className="block text-gray-700 font-semibold">VIN</label>
            <input
              type="text"
              name="vin"
              value={formData.vin}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Número de Serie Interno</label>
            <input
              type="text"
              name="internal_serial"
              value={formData.internal_serial}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Tipo de Vehículo</label>
            {vehicleTypesLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="vehicleTypeId"
                value={formData.vehicleTypeId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione un tipo de vehículo</option>
                {vehicleTypes?.map((type: any) => (
                  <option key={type.vehicleTypeId} value={type.vehicleTypeId}>
                    {type.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Fabricante</label>
            {makesLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="makeId"
                value={formData.makeId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione un fabricante</option>
                {makes?.map((make: any) => (
                  <option key={make.makeId} value={make.makeId}>
                    {make.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Modelo</label>
            {modelsLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="modelId"
                value={formData.modelId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione un modelo</option>
                {models?.map((model: any) => (
                  <option key={model.modelId} value={model.modelId}>
                    {model.name}
                  </option>
                ))}
              </select> 
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Año</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Color</label>
            {colorsLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="colorId"
                value={formData.colorId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione un color</option>
                {colors?.map((color: any) => (
                  <option key={color.colorId} value={color.colorId}>
                    {color.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Tipo de Motor</label>
            {engineTypesLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="engineTypeId"
                value={formData.engineTypeId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione un tipo de motor</option>
                {engineTypes?.map((engineType: any) => (
                  <option key={engineType.engineTypeId} value={engineType.engineTypeId}>
                    {engineType.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Tipo de Combustible</label>
            {fueltypesLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="fuelTypeId"
                value={formData.fuelTypeId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione un Tipo de Combustible</option>
                {fueltypes?.map((fueltype: any) => (
                  <option key={fueltype.fuelTypeId} value={fueltype.fuelTypeId}>
                    {fueltype.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Transmisión</label>
            {transmissionsLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="transmissionId"
                value={formData.transmissionId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione una transmisión</option>
                {transmissions?.map((transmission: any) => (
                  <option key={transmission.transmissionId} value={transmission.transmissionId}>
                    {transmission.type}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Kilometraje</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Capacidad de la Batería (kWh)</label>
            <input
              type="number"
              name="batteryCapacity"
              value={formData.batteryCapacity}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Autonomía (km)</label>
            <input
              type="number"
              name="range"
              value={formData.range}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Número de Ruedas</label>
            <input
              type="number"
              name="wheelCount"
              value={formData.wheelCount}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Precio</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Número de Stock</label>
            <input
              type="text"
              name="stockNumber"
              value={formData.stockNumber}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Estatus</label>
            {vehicleStatusesLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="statusId"
                value={formData.statusId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione un Estatus</option>
                {vehicleStatuses?.map((vehicleStatus: any) => (
                  <option key={vehicleStatus.statusId} value={vehicleStatus.statusId}>
                    {vehicleStatus.name}
                  </option>
                ))}
              </select>
            )}
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

        <button
          type="submit"
          className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Guardar Vehículo
        </button>
      </form>
    </div>
  );
};

export default CreateVehicle;
