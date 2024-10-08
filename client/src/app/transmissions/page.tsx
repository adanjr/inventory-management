"use client";

import { useState } from "react";
import {
  useGetTransmissionsQuery,
  useCreateTransmissionMutation,
  useUpdateTransmissionMutation,
  useDeleteTransmissionMutation,  
  NewTransmission,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import CreateTransmissionModal from "./CreateTransmissionModal";

import { Transmission } from "@/state/api";

const Transmissions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransmission, setSelectedTransmission] = useState<Transmission | null>(null);

  const { data: transmissions, isLoading, isError } = useGetTransmissionsQuery(searchTerm);

  const [createTransmission] = useCreateTransmissionMutation();
  const [updateTransmission] = useUpdateTransmissionMutation();
  const [deleteTransmission] = useDeleteTransmissionMutation();

  const handleCreateTransmission = async (transmissionData: NewTransmission) => {
    await createTransmission(transmissionData);
    setIsCreateModalOpen(false);
  };

   

  const handleDeleteTransmission = async (transmissionId: string) => {
    if (transmissionId) {
      await deleteTransmission(transmissionId);
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !transmissions) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch transmissions
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
            placeholder="Buscar transmisiones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Transmisiones" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Transmisión
        </button>
      </div>

      {/* BODY TRANSMISSIONS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {transmissions.map((transmission) => (
          <div
            key={transmission.transmissionId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              <h3 className="text-lg text-gray-900 font-semibold">
                {transmission.type}
              </h3>
              <div className="flex mt-4">
                <button
                  className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
                  onClick={() => {
                    setSelectedTransmission(transmission);
                    setIsEditModalOpen(true);
                  }}
                >
                  <PencilIcon className="w-5 h-5 mr-2" /> Editar
                </button>
                <button
                  className="text-red-500 hover:text-red-700 flex items-center"
                  onClick={() => handleDeleteTransmission(transmission.transmissionId)}
                >
                  <TrashIcon className="w-5 h-5 mr-2" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <CreateTransmissionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTransmission}
      />
      
    </div>
  );
};

export default Transmissions;
