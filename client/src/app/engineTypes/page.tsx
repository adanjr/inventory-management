"use client";

import { useState } from "react";
import {
  useGetEngineTypesQuery,
  useCreateEngineTypeMutation,
  useUpdateEngineTypeMutation,
  useDeleteEngineTypeMutation,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import CreateEngineTypeModal from "./CreateEngineTypeModal";
import EditEngineTypeModal from "./EditEngineTypeModal";
import { EngineType } from "@/state/api";

const EngineTypes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEngineType, setSelectedEngineType] = useState<EngineType | null>(null);

  const { data: engineTypes, isLoading, isError } = useGetEngineTypesQuery(searchTerm);

  const [createEngineType] = useCreateEngineTypeMutation();
  const [updateEngineType] = useUpdateEngineTypeMutation();
  const [deleteEngineType] = useDeleteEngineTypeMutation();

  const handleCreateEngineType = async (engineTypeData: EngineType) => {
    await createEngineType(engineTypeData);
    setIsCreateModalOpen(false);
  };

  const handleEditEngineType = async (engineTypeId: string, updatedData: Partial<EngineType>) => {
    if (engineTypeId) {
      await updateEngineType({ id: engineTypeId, data: updatedData });
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteEngineType = async (engineTypeId: string) => {
    if (engineTypeId) {
      await deleteEngineType(engineTypeId);
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !engineTypes) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch engine types
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
            placeholder="Buscar tipos de motor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Tipos de Motor" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Tipo
        </button>
      </div>

      {/* BODY ENGINE TYPES LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {engineTypes.map((engineType) => (
          <div
            key={engineType.engineTypeId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              <h3 className="text-lg text-gray-900 font-semibold">
                {engineType.name}
              </h3>
              <div className="flex mt-4">
                <button
                  className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
                  onClick={() => {
                    setSelectedEngineType(engineType);
                    setIsEditModalOpen(true);
                  }}
                >
                  <PencilIcon className="w-5 h-5 mr-2" /> Editar
                </button>
                <button
                  className="text-red-500 hover:text-red-700 flex items-center"
                  onClick={() => handleDeleteEngineType(engineType.engineTypeId)}
                >
                  <TrashIcon className="w-5 h-5 mr-2" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <CreateEngineTypeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateEngineType}
      />
      {selectedEngineType && (
        <EditEngineTypeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          engineTypeId={selectedEngineType.engineTypeId}
        />
      )}
    </div>
  );
};

export default EngineTypes;
