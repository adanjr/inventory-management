"use client";

import { useState } from "react";
import {
  useGetVehicleAvailabilityStatusesQuery,
  useCreateVehicleAvailabilityStatusMutation,
  useUpdateVehicleAvailabilityStatusMutation,
  useDeleteVehicleAvailabilityStatusMutation
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import CreateVehicleAvailabilityStatusModal from "./CreateVehicleAvailabilityStatusModal";
import EditVehicleAvailabilityStatusModal from "./EditVehicleAvailabilityStatusModal";
import { VehicleAvailabilityStatus } from "@/state/api";

const VehicleAvailabilityStatusPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<VehicleAvailabilityStatus | null>(null);

  const { data: vehicleAvailabilityStatuses, isLoading, isError } = useGetVehicleAvailabilityStatusesQuery("");
  const [createVehicleAvailabilityStatus] = useCreateVehicleAvailabilityStatusMutation();
  const [updateVehicleAvailabilityStatus] = useUpdateVehicleAvailabilityStatusMutation();
  const [deleteVehicleAvailabilityStatus] = useDeleteVehicleAvailabilityStatusMutation();

  const handleCreateVehicleAvailabilityStatus = async (statusData: VehicleAvailabilityStatus) => {
    await createVehicleAvailabilityStatus(statusData);
    setIsCreateModalOpen(false);
  };

  const handleEditVehicleAvailabilityStatus = async (statusId: string, updatedData: Partial<VehicleAvailabilityStatus>) => {
    if (statusId) {
      await updateVehicleAvailabilityStatus({ id: statusId, data: updatedData });
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteVehicleAvailabilityStatus = async (statusId: string) => {
    if (statusId) {
      await deleteVehicleAvailabilityStatus(statusId);
    }
  };

  // Filtrar y ordenar estados de disponibilidad
  const filteredAndSortedStatuses = vehicleAvailabilityStatuses
    ?.filter((status) =>
      status.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente por 'name'

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !vehicleAvailabilityStatuses) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch vehicle availability statuses
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
            placeholder="Buscar estados de disponibilidad de vehículos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Estados de Disponibilidad de Vehículos" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Estado
        </button>
      </div>

      {/* BODY VEHICLE AVAILABILITY STATUS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {filteredAndSortedStatuses?.map((status) => (
          <div
            key={status.statusId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              <h3 className="text-lg text-gray-900 font-semibold">
                {status.name}
              </h3>             
              <div className="flex mt-4">
                <button
                  className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
                  onClick={() => {
                    setSelectedStatus(status);
                    setIsEditModalOpen(true);
                  }}
                >
                  <PencilIcon className="w-5 h-5 mr-2" /> Editar
                </button>
                <button
                  className="text-red-500 hover:text-red-700 flex items-center"
                  onClick={() => handleDeleteVehicleAvailabilityStatus(status.statusId)}
                >
                  <TrashIcon className="w-5 h-5 mr-2" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <CreateVehicleAvailabilityStatusModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateVehicleAvailabilityStatus}
      />

      <EditVehicleAvailabilityStatusModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditVehicleAvailabilityStatus}
        selectedStatus={selectedStatus}
      />
    </div>
  );
};

export default VehicleAvailabilityStatusPage;
