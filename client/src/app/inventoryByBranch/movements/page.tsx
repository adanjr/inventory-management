"use client";

import { useState } from 'react';
import Header from '@/app/(components)/Header';

type MovementFormData = {
  productId?: number;
  vehicleId?: number;
  fromLocationId: number;
  toLocationId: number;
  quantity?: number;
  movementType: string;
  movementDate: string;
  status: string;
  notes?: string;
};

// Mocked data for locations and vehicles/products (can be replaced with real data later)
const locations = [
  { id: 1, name: 'Almacén Central' },
  { id: 2, name: 'Sucursal Norte' },
  { id: 3, name: 'Sucursal Sur' },
];

const vehicles = [
  { id: 1, name: 'Moto A (VIN 12345)' },
  { id: 2, name: 'Moto B (VIN 67890)' },
];

const products = [
  { id: 1, name: 'Casco' },
  { id: 2, name: 'Llanta' },
];

const InventoryMovementsPage = () => {
  const [formData, setFormData] = useState<MovementFormData>({
    fromLocationId: 1,
    toLocationId: 2,
    movementType: 'transfer',
    movementDate: new Date().toISOString().slice(0, 10),
    status: 'in transit',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add logic to handle movement submission here
    console.log("Submitted Movement Data:", formData);
  };

  return (
    <div className="mx-auto py-5 w-full">
      {/* Header */}
      <Header name="Registrar Movimiento de Inventario" />

      {/* Movement Form */}
      <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-2 gap-6">
        
        {/* From Location */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Ubicación de Origen</label>
          <select
            name="fromLocationId"
            value={formData.fromLocationId}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
          >
            {locations.map(location => (
              <option key={location.id} value={location.id}>{location.name}</option>
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
            {locations.map(location => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>
        </div>

        {/* Movement Type */}
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

        {/* Movement Status */}
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

        {/* Product or Vehicle Selection */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Producto o Vehículo</label>
          <select
            name="productId"
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
          >
            <option value="">Seleccionar producto</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>

          <select
            name="vehicleId"
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 mt-2"
          >
            <option value="">Seleccionar vehículo</option>
            {vehicles.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
            ))}
          </select>
        </div>

        {/* Quantity (For Products without Serial Numbers) */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Cantidad (solo productos)</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity || ""}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
            placeholder="Ej: 10"
          />
        </div>

        {/* Movement Date */}
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

        {/* Notes */}
        <div className="flex flex-col col-span-2">
          <label className="text-gray-700 font-medium">Notas</label>
          <textarea
            name="notes"
            value={formData.notes || ""}
          
            className="border border-gray-300 rounded p-2"
            placeholder="Agregar notas sobre el movimiento"
          />
        </div>

        {/* Submit Button */}
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
