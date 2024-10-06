"use client";

import { useState } from "react";
import {
  useGetAuditTypesQuery,
  useCreateAuditTypeMutation,
  useUpdateAuditTypeMutation,
  useDeleteAuditTypeMutation
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import CreateAuditTypeModal from "./CreateAuditTypeModal";
import EditAuditTypeModal from "./EditAuditTypeModal";
import { AuditType } from "@/state/api";

const AuditTypes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAuditType, setSelectedAuditType] = useState<AuditType | null>(null);

  const { data: auditTypes, isLoading, isError } = useGetAuditTypesQuery("");
  const [createAuditType] = useCreateAuditTypeMutation();
  const [updateAuditType] = useUpdateAuditTypeMutation();
  const [deleteAuditType] = useDeleteAuditTypeMutation();

  const handleCreateAuditType = async (auditTypeData: AuditType) => {
    await createAuditType(auditTypeData);
    setIsCreateModalOpen(false);
  };

  const handleEditAuditType = async (auditTypeId: string, updatedData: Partial<AuditType>) => {
    if (auditTypeId) {
      await updateAuditType({ id: auditTypeId, data: updatedData });
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteAuditType = async (auditTypeId: string) => {
    if (auditTypeId) {
      await deleteAuditType(auditTypeId);
    }
  };

  // Filtrar y ordenar tipos de auditoría
  const filteredAndSortedAuditTypes = auditTypes
    ?.filter((auditType) =>
      auditType.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente por 'name'

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !auditTypes) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch audit types
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
            placeholder="Buscar tipos de auditoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Tipos de Auditoría" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Tipo de Auditoría
        </button>
      </div>

      {/* BODY AUDIT TYPES LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {filteredAndSortedAuditTypes?.map((auditType) => (
          <div
            key={auditType.auditTypeId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              <h3 className="text-lg text-gray-900 font-semibold">
                {auditType.name}
              </h3>
              <div className="flex mt-4">
                <button
                  className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
                  onClick={() => {
                    setSelectedAuditType(auditType);
                    setIsEditModalOpen(true);
                  }}
                >
                  <PencilIcon className="w-5 h-5 mr-2" /> Editar
                </button>
                <button
                  className="text-red-500 hover:text-red-700 flex items-center"
                  onClick={() => handleDeleteAuditType(auditType.auditTypeId)}
                >
                  <TrashIcon className="w-5 h-5 mr-2" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <CreateAuditTypeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateAuditType}
      />

      <EditAuditTypeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditAuditType}
        selectedAuditType={selectedAuditType}
      />
    </div>
  );
};

export default AuditTypes;
