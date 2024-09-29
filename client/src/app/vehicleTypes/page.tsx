"use client";

import { useState } from "react";
import {
  useGetVehicleTypesQuery,
  useCreateVehicleTypeMutation,
  useUpdateVehicleTypeMutation,
  useDeleteVehicleTypeMutation,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import CreateVehicleTypeModal from "./CreateVehicleTypeModal";
import EditVehicleTypeModal from "./EditVehicleTypeModal";
import { VehicleType } from "@/state/api";

const VehicleTypes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | null>(null);

  const { data: vehicleTypes, isLoading, isError } = useGetVehicleTypesQuery(searchTerm);

  const [createVehicleType] = useCreateVehicleTypeMutation();
  const [updateVehicleType] = useUpdateVehicleTypeMutation();
  const [deleteVehicleType] = useDeleteVehicleTypeMutation();

  const handleCreateVehicleType = async (vehicleTypeData: VehicleType) => {
    await createVehicleType(vehicleTypeData);
    setIsCreateModalOpen(false);
  };

  const handleEditVehicleType = async (vehicleTypeId: string, updatedData: Partial<VehicleType>) => {
    if (vehicleTypeId) {
      await updateVehicleType({ id: vehicleTypeId, data: updatedData });
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteVehicleType = async (vehicleTypeId: string) => {
    if (vehicleTypeId) {
      await deleteVehicleType(vehicleTypeId);
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !vehicleTypes) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch vehicle types
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Buscar tipos de vehículo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Tipos de Vehículo" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Tipo
        </button>
      </div>

      {/* BODY VEHICLE TYPE LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {vehicleTypes.map((vehicleType) => (
          <div
            key={vehicleType.vehicleTypeId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              <h3 className="text-lg text-gray-900 font-semibold">
                {vehicleType.name}
              </h3>
              <div className="flex mt-4">
                <button
                  className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
                  onClick={() => {
                    setSelectedVehicleType(vehicleType);
                    setIsEditModalOpen(true);
                  }}
                >
                  <PencilIcon className="w-5 h-5 mr-2" /> Editar
                </button>
                <button
                  className="text-red-500 hover:text-red-700 flex items-center"
                  onClick={() => handleDeleteVehicleType(vehicleType.vehicleTypeId)}
                >
                  <TrashIcon className="w-5 h-5 mr-2" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <CreateVehicleTypeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateVehicleType}
      />
      {selectedVehicleType && (
        <EditVehicleTypeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          vehicleTypeId={selectedVehicleType.vehicleTypeId}
        />
      )}
    </div>
  );
};

export default VehicleTypes;