"use client";

import { useState } from "react";
import {
  useGetVehicleStatusesQuery,
  useCreateVehicleStatusMutation,
  useUpdateVehicleStatusMutation,
  useDeleteVehicleStatusMutation,
  NewVehicleStatus,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import CreateVehicleStatusModal from "./CreateVehicleStatusModal";
import EditVehicleStatusModal from "./EditVehicleStatusModal"; // Asegúrate de tener este componente
import { VehicleStatus } from "@/state/api";

const VehicleStatuses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVehicleStatus, setSelectedVehicleStatus] = useState<VehicleStatus | null>(null);

  const { data: vehicleStatuses, isLoading, isError } = useGetVehicleStatusesQuery(searchTerm);

  const [createVehicleStatus] = useCreateVehicleStatusMutation();
  const [updateVehicleStatus] = useUpdateVehicleStatusMutation();
  const [deleteVehicleStatus] = useDeleteVehicleStatusMutation();

  const handleCreateVehicleStatus = async (vehicleStatusData: NewVehicleStatus) => {
    await createVehicleStatus(vehicleStatusData);
    setIsCreateModalOpen(false);
  };

  const handleUpdateVehicleStatus = async (vehicleStatusData: VehicleStatus) => {
    if (selectedVehicleStatus) {
      await updateVehicleStatus({ ...selectedVehicleStatus, ...vehicleStatusData });
      setIsEditModalOpen(false);
      setSelectedVehicleStatus(null); // Limpiar la selección tras la edición
    }
  };

  const handleDeleteVehicleStatus = async (vehicleStatusId: string) => {
    if (vehicleStatusId) {
      await deleteVehicleStatus(vehicleStatusId);
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !vehicleStatuses) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch vehicle statuses
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
            placeholder="Buscar estados de vehículo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Estados de Vehículo" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Estado
        </button>
      </div>

      {/* BODY VEHICLE STATUS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {vehicleStatuses.map((vehicleStatus) => (
          <div
            key={vehicleStatus.statusId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              <h3 className="text-lg text-gray-900 font-semibold">
                {vehicleStatus.name}
              </h3>
              <div className="flex mt-4">
                <button
                  className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
                  onClick={() => {
                    setSelectedVehicleStatus(vehicleStatus);
                    setIsEditModalOpen(true);
                  }}
                >
                  <PencilIcon className="w-5 h-5 mr-2" /> Editar
                </button>
                <button
                  className="text-red-500 hover:text-red-700 flex items-center"
                  onClick={() => handleDeleteVehicleStatus(vehicleStatus.statusId)}
                >
                  <TrashIcon className="w-5 h-5 mr-2" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <CreateVehicleStatusModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateVehicleStatus}
      />
      <EditVehicleStatusModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleUpdateVehicleStatus}
        initialData={selectedVehicleStatus} // Cambiar 'vehicleStatus' por 'initialData'
      />
    </div>
  );
};

export default VehicleStatuses;
