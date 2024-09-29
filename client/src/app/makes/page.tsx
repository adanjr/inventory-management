"use client";

import { useState } from "react";
import {
  useGetMakesQuery,
  useCreateMakeMutation,
  useUpdateMakeMutation,
  useDeleteMakeMutation,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import CreateMakeModal from "./CreateMakeModal";
import EditMakeModal from "./EditMakeModal";
import { Make } from "@/state/api";

const Makes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMake, setSelectedMake] = useState<Make | null>(null);

  const { data: makes, isLoading, isError } = useGetMakesQuery(searchTerm);

  const [createMake] = useCreateMakeMutation();
  const [updateMake] = useUpdateMakeMutation();
  const [deleteMake] = useDeleteMakeMutation();

  const handleCreateMake = async (makeData: Make) => {
    await createMake(makeData);
    setIsCreateModalOpen(false);
  };

  const handleEditMake = async (makeId: string, updatedData: Partial<Make>) => {
    if (makeId) {
      await updateMake({ id: makeId, data: updatedData });
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteMake = async (makeId: string) => {
    if (makeId) {
      await deleteMake(makeId);
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !makes) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch makes
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
            placeholder="Buscar fabricantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Fabricantes" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Fabricante
        </button>
      </div>

      {/* BODY MAKES LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {makes.map((make) => (
          <div
            key={make.makeId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              <h3 className="text-lg text-gray-900 font-semibold">
                {make.name}
              </h3>
              {make.country && (
                <p className="text-gray-600">Country: {make.country}</p>
              )}
              <div className="flex mt-4">
                <button
                  className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
                  onClick={() => {
                    setSelectedMake(make);
                    setIsEditModalOpen(true);
                  }}
                >
                  <PencilIcon className="w-5 h-5 mr-2" /> Editar
                </button>
                <button
                  className="text-red-500 hover:text-red-700 flex items-center"
                  onClick={() => handleDeleteMake(make.makeId)}
                >
                  <TrashIcon className="w-5 h-5 mr-2" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <CreateMakeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateMake}
      />
      {selectedMake && (
        <EditMakeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          makeId={selectedMake.makeId}
        />
      )}
    </div>
  );
};

export default Makes;
