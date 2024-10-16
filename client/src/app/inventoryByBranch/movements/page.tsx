"use client";

import { useState } from 'react';
import { 
  useGetLocationsQuery, 
  useGetVehiclesQuery, 
  useGetProductsQuery  
} from "@/state/api";
import Header from '@/app/(components)/Header';
import { Product, Location, Vehicle } from '@/state/api'; // Asegúrate de importar tus interfaces

type MovementFormData = {
  productId?: string; // Cambiado a string para que coincida con Product
  vehicleId?: number;
  fromLocationId: string; // Cambiado a string para que coincida con Location
  toLocationId: string; // Cambiado a string para que coincida con Location
  quantity?: number;
  movementType: string;
  movementDate: string;
  status: string;
  notes?: string;
};

const InventoryMovementsPage = () => {

  const { data: products = [], isLoading: productsLoading, isError: productsError } = useGetProductsQuery();


  const [formData, setFormData] = useState<MovementFormData>({
    fromLocationId: '',
    toLocationId: '',
    vehicleId: undefined, // Asegúrate de inicializarlo correctamente
    productId: undefined,
    movementType: 'transfer',
    movementDate: new Date().toISOString().slice(0, 10),
    status: 'in transit',
  });

  const { data: locations = [], isLoading: locationsLoading } = useGetLocationsQuery();
  const { data: vehicles = [], isLoading: vehiclesLoading, isError } = useGetVehiclesQuery();

  const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted Movement Data:", formData);
  };

  return (
    <div className="mx-auto py-5 w-full">
      <Header name="Registrar Movimiento de Inventario" />

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
              <option key={location.locationId} value={location.locationId} disabled={formData.fromLocationId === location.locationId}>
                {location.name}
              </option>
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

        {/* Product Selection */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Producto</label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2"
          >
            <option value="">Seleccionar producto</option>
            {products.map((product: Product) => (
              <option key={product.productId} value={product.productId}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {/* Vehicle Selection */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Vehículo</label>
          {vehiclesLoading ? (
            <p>Cargando vehículos...</p> // Mensaje de carga
          ) : isError ? (
            <p>Error al cargar vehículos.</p> // Mensaje de error
          ) : (
            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2"
            >
              <option value="">Seleccionar vehículo</option>
              {vehicles.map((vehicle: Vehicle) => (
                <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                  {`${vehicle.model.name} ${vehicle.color.name} ${vehicle.internal_serial}`}
                </option>
              ))}
            </select>
          )}
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
            onChange={handleChange}
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
