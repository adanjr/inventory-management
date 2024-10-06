import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Header from "@/app/(components)/Header";

type ModelFormData = {
  modelId: string;
  name: string;
  makeId: number;
  year_start?: string;
  year_end?: string;
  vehicleTypeId: number;
  engineTypeId: number;
  fuelTypeId: number;
  transmissionId: number;
  batteryCapacity: number;
  range: number;
  wheelCount: number;
  basePrice: number;
  chargeTime: number;
  motorWattage: number;
  weightCapacity: number;
  speed: number;
  batteryVoltage: number;
};

type EditModelModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (formData: ModelFormData) => void;
  initialData: ModelFormData | null;
  makes: { makeId: string; name: string }[];
  vehicleTypes: { vehicleTypeId: string; name: string }[];
  engineTypes: { engineTypeId: string; name: string }[];
  fuelTypes: { fuelTypeId: string; name: string }[];
  transmissions: { transmissionId: string; type: string }[];
};

const EditModelModal = ({
  isOpen,
  onClose,
  onEdit,
  initialData,
  makes,
  vehicleTypes,
  engineTypes,
  fuelTypes,
  transmissions,
}: EditModelModalProps) => {
  const [formData, setFormData] = useState<ModelFormData | null>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.endsWith("Id") || name.includes("capacity") || name.includes("wattage") || name.includes("voltage") || name.includes("speed")
        ? parseFloat(value)
        : value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData) {
      onEdit(formData);
    }
    onClose();
  };

  if (!isOpen || !formData) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles = "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl h-auto shadow-lg rounded-md bg-white">
        <Header name="Editar Modelo" />
        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Model Name */}
          <label htmlFor="modelName" className={labelCssStyles}>
            Nombre de Modelo
          </label>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          />

          {/* Make */}
          <label htmlFor="makeId" className={labelCssStyles}>
            Marca
          </label>
          <select
            name="makeId"
            onChange={handleChange}
            value={formData.makeId}
            className={inputCssStyles}
            required
          >
            {makes.map((make) => (
              <option key={make.makeId} value={make.makeId}>
                {make.name}
              </option>
            ))}
          </select>

          {/* Year Start */}
          <label htmlFor="year_start" className={labelCssStyles}>
            Año Inicio
          </label>
          <input
            type="text"
            name="year_start"
            placeholder="Año Inicio"
            onChange={handleChange}
            value={formData.year_start}
            className={inputCssStyles}
          />

          {/* Year End */}
          <label htmlFor="year_end" className={labelCssStyles}>
            Año Fin
          </label>
          <input
            type="text"
            name="year_end"
            placeholder="Año Fin"
            onChange={handleChange}
            value={formData.year_end}
            className={inputCssStyles}
          />

          {/* Vehicle Type */}
          <label htmlFor="vehicleTypeId" className={labelCssStyles}>
            Tipo de Vehículo
          </label>
          <select
            name="vehicleTypeId"
            onChange={handleChange}
            value={formData.vehicleTypeId}
            className={inputCssStyles}
          >
            {vehicleTypes.map((type) => (
              <option key={type.vehicleTypeId} value={type.vehicleTypeId}>
                {type.name}
              </option>
            ))}
          </select>

          {/* Engine Type */}
          <label htmlFor="engineTypeId" className={labelCssStyles}>
            Tipo de Motor
          </label>
          <select
            name="engineTypeId"
            onChange={handleChange}
            value={formData.engineTypeId}
            className={inputCssStyles}
          >
            {engineTypes.map((engine) => (
              <option key={engine.engineTypeId} value={engine.engineTypeId}>
                {engine.name}
              </option>
            ))}
          </select>

          {/* Fuel Type */}
          <label htmlFor="fuelTypeId" className={labelCssStyles}>
            Tipo de Combustible
          </label>
          <select
            name="fuelTypeId"
            onChange={handleChange}
            value={formData.fuelTypeId}
            className={inputCssStyles}
          >
            {fuelTypes.map((fuel) => (
              <option key={fuel.fuelTypeId} value={fuel.fuelTypeId}>
                {fuel.name}
              </option>
            ))}
          </select>

          {/* Transmission */}
          <label htmlFor="transmissionId" className={labelCssStyles}>
            Transmisión
          </label>
          <select
            name="transmissionId"
            onChange={handleChange}
            value={formData.transmissionId}
            className={inputCssStyles}
          >
            {transmissions.map((transmission) => (
              <option key={transmission.transmissionId} value={transmission.transmissionId}>
                {transmission.type}
              </option>
            ))}
          </select>

          {/* Other Fields */}
          <label htmlFor="batteryCapacity" className={labelCssStyles}>
            Capacidad de la Batería
          </label>
          <input
            type="number"
            name="batteryCapacity"
            onChange={handleChange}
            value={formData.batteryCapacity}
            className={inputCssStyles}
          />

          <label htmlFor="range" className={labelCssStyles}>
            Autonomía (km)
          </label>
          <input
            type="number"
            name="range"
            onChange={handleChange}
            value={formData.range}
            className={inputCssStyles}
          />

          <label htmlFor="wheelCount" className={labelCssStyles}>
            Número de Ruedas
          </label>
          <input
            type="number"
            name="wheelCount"
            onChange={handleChange}
            value={formData.wheelCount}
            className={inputCssStyles}
          />

          <label htmlFor="basePrice" className={labelCssStyles}>
            Precio Base
          </label>
          <input
            type="number"
            name="basePrice"
            onChange={handleChange}
            value={formData.basePrice}
            className={inputCssStyles}
          />

          <label htmlFor="chargeTime" className={labelCssStyles}>
            Tiempo de Carga (horas)
          </label>
          <input
            type="number"
            name="chargeTime"
            onChange={handleChange}
            value={formData.chargeTime}
            className={inputCssStyles}
          />

          <label htmlFor="motorWattage" className={labelCssStyles}>
            Potencia del Motor (W)
          </label>
          <input
            type="number"
            name="motorWattage"
            onChange={handleChange}
            value={formData.motorWattage}
            className={inputCssStyles}
          />

          <label htmlFor="weightCapacity" className={labelCssStyles}>
            Capacidad de Carga (kg)
          </label>
          <input
            type="number"
            name="weightCapacity"
            onChange={handleChange}
            value={formData.weightCapacity}
            className={inputCssStyles}
          />

          <label htmlFor="speed" className={labelCssStyles}>
            Velocidad Máxima (km/h)
          </label>
          <input
            type="number"
            name="speed"
            onChange={handleChange}
            value={formData.speed}
            className={inputCssStyles}
          />

          <label htmlFor="batteryVoltage" className={labelCssStyles}>
            Voltaje de la Batería (V)
          </label>
          <input
            type="number"
            name="batteryVoltage"
            onChange={handleChange}
            value={formData.batteryVoltage}
            className={inputCssStyles}
          />

          {/* Submit & Cancel */}
          <div className="col-span-4 flex justify-end space-x-2 mt-4">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
              Editar
            </button>
            <button onClick={onClose} type="button" className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModelModal;
