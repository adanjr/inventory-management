"use client";

import { useState } from "react";
import {
  useGetModelsQuery,
  useCreateModelMutation,
  useUpdateModelMutation,
  useDeleteModelMutation,
  useGetMakesQuery,
  NewModel,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import CreateModelModal from "./CreateModelModal";
import EditModelModal from "./EditModelModal";
import { Model } from "@/state/api";

const Models = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  const { data: models, isLoading, isError } = useGetModelsQuery(searchTerm);
  const { data: makes = [] } = useGetMakesQuery();

  const [createModel] = useCreateModelMutation();
  const [updateModel] = useUpdateModelMutation();
  const [deleteModel] = useDeleteModelMutation();

  const handleCreateModel = async (newModelData: NewModel) => {
    try {
      // Convierte los valores a los tipos correctos
      const modelData = {
        ...newModelData,
        battery_capacity: parseFloat(newModelData.battery_capacity || "0"),
        electric_range: parseFloat(newModelData.electric_range || "0"),
        makeId: parseInt(newModelData.makeId, 10), // Si makeId debería ser un número
      };
  
      console.log("Creating model with data:", modelData); // Log para depuración
      await createModel(modelData).unwrap();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create model:", error);
    }
  };

  const handleEditModel = async (modelId: string, updatedData: Partial<Model>) => {
    if (modelId) {
      try {
        await updateModel({ id: modelId, data: updatedData }).unwrap();
        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Failed to update model:", error);
      }
    }
  };

  const handleDeleteModel = async (modelId: string) => {
    if (modelId) {
      try {
        await deleteModel(modelId).unwrap();
      } catch (error) {
        console.error("Failed to delete model:", error);
      }
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !models) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch models
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
            placeholder="Buscar modelos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Modelos" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Modelo
        </button>
      </div>

      {/* BODY MODELS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {models.map((model) => (
          <div
            key={model.modelId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              <h3 className="text-lg text-gray-900 font-semibold">
                {model.name}
              </h3>
              {model.makeId && (
                <p className="text-gray-600">Fabricante: {model.make.name}</p>
              )}
              {model.year_start && (
                <p className="text-gray-600">Año Inicio: {model.year_start}</p>
              )}
              {model.year_end && (
                <p className="text-gray-600">Año Fin: {model.year_end}</p>
              )}
              <div className="flex mt-4">
                <button
                  className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
                  onClick={() => {
                    setSelectedModel(model);
                    setIsEditModalOpen(true);
                  }}
                >
                  <PencilIcon className="w-5 h-5 mr-2" /> Editar
                </button>
                <button
                  className="text-red-500 hover:text-red-700 flex items-center"
                  onClick={() => handleDeleteModel(model.modelId)}
                >
                  <TrashIcon className="w-5 h-5 mr-2" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <CreateModelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateModel}
        makes={makes}
      />

      {selectedModel && (
        <EditModelModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          modelId={selectedModel.modelId}
          onEdit={handleEditModel} // Pasar la función para editar
        />
      )}
    </div>
  );
};

export default Models;