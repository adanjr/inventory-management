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

  const handleClose = () => {
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
          {/* MODEL NAME */}
          <div className="col-span-1">
            <label htmlFor="name" className={labelCssStyles}>
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
          </div>

          {/* MAKE SELECTION */}
          <div className="col-span-1">
            <label htmlFor="makeId" className={labelCssStyles}>
              Fabricante
            </label>
            <select
              name="makeId"
              onChange={handleChange}
              value={formData.makeId}
              className={inputCssStyles}
              required
            >
              <option value="">Selecciona un fabricante</option>
              {makes.map((make) => (
                <option key={make.makeId} value={make.makeId}>
                  {make.name}
                </option>
              ))}
            </select>
          </div>

          {/* YEAR START */}
          <div className="col-span-1">
            <label htmlFor="year_start" className={labelCssStyles}>
              Año de Inicio
            </label>
            <input
              type="text"
              name="year_start"
              placeholder="Año de Inicio"
              onChange={handleChange}
              value={formData.year_start}
              className={inputCssStyles}
            />
          </div>

          {/* YEAR END */}
          <div className="col-span-1">
            <label htmlFor="year_end" className={labelCssStyles}>
              Año de Fin
            </label>
            <input
              type="text"
              name="year_end"
              placeholder="Año de Fin"
              onChange={handleChange}
              value={formData.year_end}
              className={inputCssStyles}
            />
          </div>

          {/* VEHICLE TYPE */}
          <div className="col-span-1">
            <label htmlFor="vehicleTypeId" className={labelCssStyles}>
              Tipo de Vehículo
            </label>
            <select
              name="vehicleTypeId"
              onChange={handleChange}
              value={formData.vehicleTypeId}
              className={inputCssStyles}
              required
            >
              <option value="">Selecciona un tipo</option>
              {vehicleTypes.map((type) => (
                <option key={type.vehicleTypeId} value={type.vehicleTypeId}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* ENGINE TYPE */}
          <div className="col-span-1">
            <label htmlFor="engineTypeId" className={labelCssStyles}>
              Tipo de Motor
            </label>
            <select
              name="engineTypeId"
              onChange={handleChange}
              value={formData.engineTypeId}
              className={inputCssStyles}
              required
            >
              <option value="">Selecciona un tipo de motor</option>
              {engineTypes.map((engine) => (
                <option key={engine.engineTypeId} value={engine.engineTypeId}>
                  {engine.name}
                </option>
              ))}
            </select>
          </div>

          {/* FUEL TYPE */}
          <div className="col-span-1">
            <label htmlFor="fuelTypeId" className={labelCssStyles}>
              Tipo de Carga
            </label>
            <select
              name="fuelTypeId"
              onChange={handleChange}
              value={formData.fuelTypeId}
              className={inputCssStyles}
              required
            >
              <option value="">Selecciona un tipo de carga</option>
              {fuelTypes.map((fuel) => (
                <option key={fuel.fuelTypeId} value={fuel.fuelTypeId}>
                  {fuel.name}
                </option>
              ))}
            </select>
          </div>

          {/* TRANSMISSION */}
          <div className="col-span-1">
            <label htmlFor="transmissionId" className={labelCssStyles}>
              Transmisión
            </label>
            <select
              name="transmissionId"
              onChange={handleChange}
              value={formData.transmissionId}
              className={inputCssStyles}
              required
            >
              <option value="">Selecciona una transmisión</option>
              {transmissions.map((transmission) => (
                <option key={transmission.transmissionId} value={transmission.transmissionId}>
                  {transmission.type}
                </option>
              ))}
            </select>
          </div>

          {/* BATTERY CAPACITY */}
          <div className="col-span-1">
            <label htmlFor="batteryCapacity" className={labelCssStyles}>
              Capacidad de Batería (kWh)
            </label>
            <input
              type="number"
              name="batteryCapacity"
              placeholder="Capacidad de Batería"
              onChange={handleChange}
              value={formData.batteryCapacity}
              className={inputCssStyles}
            />
          </div>

          {/* ELECTRIC RANGE */}
          <div className="col-span-1">
            <label htmlFor="range" className={labelCssStyles}>
                 Autonomía (km)
            </label>
            <input
              type="number"
              name="range"
              placeholder="Autonomía"
              onChange={handleChange}
              value={formData.range}
              className={inputCssStyles}
            />
          </div>

          {/* WHEEL COUNT */}
          <div className="col-span-1">
            <label htmlFor="wheelCount" className={labelCssStyles}>
              Cantidad de Ruedas
            </label>
            <input
              type="number"
              name="wheelCount"
              placeholder="Cantidad de Ruedas"
              onChange={handleChange}
              value={formData.wheelCount}
              className={inputCssStyles}
            />
          </div>

          {/* PRICE */}
          <div className="col-span-1">
            <label htmlFor="basePrice" className={labelCssStyles}>
              Precio Base(MXN)
            </label>
            <input
              type="number"
              name="basePrice"
              placeholder="Precio"
              onChange={handleChange}
              value={formData.basePrice}
              className={inputCssStyles}
            />
          </div>

          {/* CHARGE TIME */}
          <div className="col-span-1">
            <label htmlFor="chargeTime" className={labelCssStyles}>
              Tiempo de Carga (horas)
            </label>
            <input
              type="number"
              name="chargeTime"
              placeholder="Tiempo de Carga"
              onChange={handleChange}
              value={formData.chargeTime}
              className={inputCssStyles}
            />
          </div>

          {/* MOTOR WATTAGE */}
          <div className="col-span-1">
            <label htmlFor="motorWattage" className={labelCssStyles}>
              Potencia del Motor (W)
            </label>
            <input
              type="number"
              name="motorWattage"
              placeholder="Potencia del Motor"
              onChange={handleChange}
              value={formData.motorWattage}
              className={inputCssStyles}
            />
          </div>

          {/* WEIGHT CAPACITY */}
          <div className="col-span-1">
            <label htmlFor="weightCapacity" className={labelCssStyles}>
              Capacidad de Peso (kg)
            </label>
            <input
              type="number"
              name="weightCapacity"
              placeholder="Capacidad de Peso"
              onChange={handleChange}
              value={formData.weightCapacity}
              className={inputCssStyles}
            />
          </div>

          {/* SPEED */}
          <div className="col-span-1">
            <label htmlFor="speed" className={labelCssStyles}>
              Velocidad Máxima (km/h)
            </label>
            <input
              type="number"
              name="speed"
              placeholder="Velocidad Máxima"
              onChange={handleChange}
              value={formData.speed}
              className={inputCssStyles}
            />
          </div>

          {/* BATTERY VOLTAGE */}
          <div className="col-span-1">
            <label htmlFor="batteryVoltage" className={labelCssStyles}>
              Voltaje de Batería (V)
            </label>
            <input
              type="number"
              name="batteryVoltage"
              placeholder="Voltaje de Batería"
              onChange={handleChange}
              value={formData.batteryVoltage}
              className={inputCssStyles}
            />
          </div>

         {/* BUTTONS */}
         <div className="col-span-4 flex justify-end mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-400 text-white py-2 px-4 mr-2 rounded hover:bg-gray-500 transition duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModelModal;
