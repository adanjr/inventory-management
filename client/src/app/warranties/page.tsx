"use client";

import { useState } from "react";
import {
  useGetWarrantiesQuery,
  useCreateWarrantyMutation,
  useUpdateWarrantyMutation,
  useDeleteWarrantyMutation,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import CreateWarrantyModal from "./CreateWarrantyModal";
import EditWarrantyModal from "./EditWarrantyModal";
import { Warranty } from "@/state/api";

const Warranties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<Warranty | null>(null);

  const { data: warranties, isLoading, isError } = useGetWarrantiesQuery("");
  const [createWarranty] = useCreateWarrantyMutation();
  const [updateWarranty] = useUpdateWarrantyMutation();
  const [deleteWarranty] = useDeleteWarrantyMutation();

  const handleCreateWarranty = async (warrantyData: Warranty) => {
    await createWarranty(warrantyData);
    setIsCreateModalOpen(false);
  };

  const handleEditWarranty = async (warrantyId: string, updatedData: Partial<Warranty>) => {
    if (warrantyId) {
      await updateWarranty({ id: warrantyId, data: updatedData });
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteWarranty = async (warrantyId: string) => {
    if (warrantyId) {
      await deleteWarranty(warrantyId);
    }
  };

  // Filtrar y ordenar garantías
  const filteredAndSortedWarranties = warranties
    ?.filter((warranty) =>
      warranty.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.description?.localeCompare(b.description || '') || 0); // Ordenar alfabéticamente por 'description'

  if (isLoading) {
    return <div className="py-4">Cargando...</div>;
  }

  if (isError || !warranties) {
    return (
      <div className="text-center text-red-500 py-4">
        Error al obtener las garantías
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
            placeholder="Buscar garantías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Garantías de Vehículos" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Garantía
        </button>
      </div>

      {/* BODY WARRANTIES LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {filteredAndSortedWarranties?.map((warranty) => (
          <div
            key={warranty.warrantyId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              <h3 className="text-lg text-gray-900 font-semibold">
                Nombre: {warranty.name}
              </h3>
              <p className="text-gray-800">Descripción: {warranty.description} </p>         
              <p className="text-gray-800">Duración: {warranty.durationMonths} meses</p>                        
              <div className="flex mt-4">
                <button
                  className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
                  onClick={() => {
                    setSelectedWarranty(warranty);
                    setIsEditModalOpen(true);
                  }}
                >
                  <PencilIcon className="w-5 h-5 mr-2" /> Editar
                </button>
                <button
                  className="text-red-500 hover:text-red-700 flex items-center"
                  onClick={() => handleDeleteWarranty(warranty.warrantyId)}
                >
                  <TrashIcon className="w-5 h-5 mr-2" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <CreateWarrantyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateWarranty}
      />

      <EditWarrantyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditWarranty}
        selectedWarranty={selectedWarranty}
      />
    </div>
  );
};

export default Warranties;
