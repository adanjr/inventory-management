'use client';

import { useState, useEffect } from 'react';
import {
  useGetLocationsQuery,
  useGetVehiclesByLocationIdQuery,
  useGetProductsQuery,
} from '@/state/api';
import Header from '@/app/(components)/Header';
import { Product, Location, Vehicle } from '@/state/api';

type MovementFormData = {
  productId?: string;
  vehicleId?: number;
  fromLocationId: string;
  toLocationId: string;
  quantity?: number;
  movementType: string;
  movementDate: string;
  status: string;
  notes?: string;
};

const InventoryMovementsPage = () => {
  const { data: products = [] } = useGetProductsQuery();
  const { data: locations = [] } = useGetLocationsQuery();
  const { data: vehicles = [] } = useGetVehiclesByLocationIdQuery("2");

  const [formData, setFormData] = useState<MovementFormData>({
    fromLocationId: '',
    toLocationId: '',
    vehicleId: undefined,
    productId: undefined,
    movementType: 'transfer',
    movementDate: new Date().toISOString().slice(0, 10),
    status: 'in transit',
  });

  // Estado para los vehículos seleccionados y disponibles
  
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>(vehicles);

  useEffect(() => {
    if (vehicles) {
      setAvailableVehicles(vehicles); // Aquí actualizamos availableVehicles cuando vehicles cambia
    }
  }, [vehicles]);

  // Manejo de cambio en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    setFormData({ ...formData, [name]: value });
  };

  // Manejo de agregar vehículo
  const handleAddVehicle = (vehicleId: number) => {
    const selectedVehicle = availableVehicles.find((v) => v.vehicleId === vehicleId);
    if (selectedVehicle) {
      setSelectedVehicles([...selectedVehicles, selectedVehicle]);
      setAvailableVehicles(availableVehicles.filter((v) => v.vehicleId !== vehicleId));
    }
  };

  // Manejo de eliminar vehículo del grid
  const handleRemoveVehicle = (vehicleId: number) => {
    const vehicleToRemove = selectedVehicles.find((v) => v.vehicleId === vehicleId);
    if (vehicleToRemove) {
      setAvailableVehicles([...availableVehicles, vehicleToRemove]);
      setSelectedVehicles(selectedVehicles.filter((v) => v.vehicleId !== vehicleId));
    }
  };

  // Manejo del submit del formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted Movement Data:", formData, "Selected Vehicles:", selectedVehicles);
  };

  return (
    <div className="mx-auto py-5 w-full">
      <Header name="Registrar Movimiento de Inventario" />

      <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-2 gap-6">
        {/* Otros inputs como Movement Type, Status, etc. */}
        {/* Manteniendo todos los inputs que ya tenías... */}
        
        {/* From Location */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Ubicación de Origen</label>
          <select
            name="fromLocationId"
            value={formData.fromLocationId}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
          >
            <option value="">Seleccionar ubicación</option>
            {locations.map((location: Location) => (
              <option key={location.locationId} value={location.locationId}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        {/* To Location */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Ubicación de Destino</label>
          <select
            name="toLocationId"
            value={formData.toLocationId}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
          >
            <option value="">Seleccionar ubicación</option>
            {locations.map((location: Location) => (
              <option
                key={location.locationId}
                value={location.locationId}
                disabled={formData.fromLocationId === location.locationId}
              >
                {location.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Tipo de Movimiento</label>
          <select
            name="movementType"
            value={formData.movementType}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
          >
            <option value="entry">Entrada</option>
            <option value="exit">Salida</option>
            <option value="transfer">Transferencia</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Estado del Movimiento</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
          >
            <option value="in transit">En tránsito</option>
            <option value="completed">Completado</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Fecha del Movimiento</label>
          <input
            type="date"
            name="movementDate"
            value={formData.movementDate}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
          />
        </div>

        {/* Vehicle Search */}
        <div className="flex flex-col col-span-2">
          <label className="text-gray-700 font-medium">Seleccionar Vehículo</label>
          <select
            onChange={(e) => handleAddVehicle(Number(e.target.value))}
            className="border border-gray-300 rounded p-2"
            value=""
          >
            <option value="">Seleccionar vehículo</option>
            {availableVehicles.map((vehicle: Vehicle) => (
              <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                {`Modelo: ${vehicle.model.name} - Color: ${vehicle.color.name} - Serial: ${vehicle.internal_serial}`}
              </option>
            ))}
          </select>
        </div>

        {/* Vehículos Seleccionados Grid */}
        <div className="col-span-2">
          <label className="text-gray-700 font-medium">Vehículos Seleccionados</label>
          <table className="min-w-full table-auto border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Modelo</th>
                <th className="border border-gray-300 px-4 py-2">Color</th>
                <th className="border border-gray-300 px-4 py-2">Serial</th>
                <th className="border border-gray-300 px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {selectedVehicles.map((vehicle: Vehicle) => (
                <tr key={vehicle.vehicleId}>
                  <td className="border border-gray-300 px-4 py-2">{vehicle.model.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{vehicle.color.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{vehicle.internal_serial}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveVehicle(vehicle.vehicleId)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col col-span-2">
          <label className="text-gray-700 font-medium">Notas</label>
          <textarea
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
            placeholder="Agregar notas sobre el movimiento"
          />
        </div>

        <div className="flex col-span-2 justify-end mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Registrar Movimiento
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryMovementsPage;