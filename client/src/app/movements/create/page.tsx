'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useGetLocationsQuery,
  useGetVehiclesByLocationIdQuery,
  useGetProductsQuery,
  useCreateMovementMutation,
} from '@/state/api';
import Header from '@/app/(components)/Header';
import { Product, Location, Vehicle } from '@/state/api';
import VehicleModal from '@/app/(components)/VehicleModal';

type MovementFormData = {
  productId?: number | null; // Cambia a number o null
  vehicleId?: number;
  fromLocationId: string;
  toLocationId: string;
  quantity?: number;
  movementType: string;
  movementDate: string;
  status: string;
  notes?: string;
};

const CreateMovementPage = () => {
  const router = useRouter();
  const { data: products = [] } = useGetProductsQuery();
  const { data: locations = [] } = useGetLocationsQuery();
  const { data: vehicles = [] } = useGetVehiclesByLocationIdQuery("2");
  const [createMovement] = useCreateMovementMutation();

  const [formData, setFormData] = useState<MovementFormData>({
    fromLocationId: '',
    toLocationId: '',
    vehicleId: undefined,
    productId: undefined,
    movementType: 'Transferencia',
    movementDate: new Date().toISOString().slice(0, 10),
    status: 'En tránsito',
  });

  // Estado para los vehículos seleccionados y disponibles
  
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>(vehicles);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (vehicles) {
      setAvailableVehicles(vehicles); // Aquí actualizamos availableVehicles cuando vehicles cambia
    }
  }, [vehicles]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleRemoveVehicle = (vehicleId: number) => {
    setSelectedVehicles(selectedVehicles.filter((v) => v.vehicleId !== vehicleId));
  };

  const handleVehicleSelection = (selected: Vehicle[]) => {
    setSelectedVehicles(selected);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Prepara los detalles del movimiento para enviarlos
    const movementDetails = selectedVehicles.map(vehicle => ({
      vehicleId: vehicle.vehicleId,
      productId: formData.productId, // Si es necesario puedes añadir un productId aquí
      inspectionStatus: 'Pendiente', // Estado inicial de la inspección
    }));
  
    const movementData = {
      fromLocationId: Number(formData.fromLocationId),
      toLocationId: Number(formData.toLocationId),
      quantity: selectedVehicles.length,
      movementType: 'Transferencia', 
      movementDate: formData.movementDate,
      status: formData.status,
      notes: formData.notes,
      approved: false,
      createdById: '3',
      details: movementDetails,
    };
  
    try {

      // Llama a la API para crear el movimiento y sus detalles
      const response = await createMovement(movementData);

      router.push('/inventoryMovements'); 
      
    } catch (error) {
      console.error('Error al crear el movimiento:', error);
      // Manejo de errores, por ejemplo, mostrar un mensaje de error
    }
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
            <option value="Entrada">Entrada</option>
            <option value="Salida">Salida</option>
            <option value="Transferencia">Transferencia</option>
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
            <option value="En tránsito">En tránsito</option>
            <option value="Completado">Completado</option>
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

        <div className="col-span-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Agregar Vehículos
          </button>
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

      <VehicleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        availableVehicles={vehicles}
        selectedVehicles={selectedVehicles}
        onSelect={handleVehicleSelection}
      />
    </div>
  );
};

export default CreateMovementPage;