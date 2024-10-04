"use client";

import { useState } from "react";
import {
  useGetColorsQuery,
  useCreateColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import CreateColorModal from "./CreateColorModal";
import EditColorModal from "./EditColorModal"; // Asumiendo que ya tienes el modal de edición
import { Color } from "@/state/api";

const Colors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  const { data: colors, isLoading, isError } = useGetColorsQuery(searchTerm);

  const [createColor] = useCreateColorMutation();
  const [updateColor] = useUpdateColorMutation();
  const [deleteColor] = useDeleteColorMutation();

  const handleCreateColor = async (colorData: Color) => {
    await createColor(colorData);
    setIsCreateModalOpen(false);
  };

  const handleEditColor = async (colorId: string, updatedData: Partial<Color>) => {
    if (colorId) {
      await updateColor({ id: colorId, data: updatedData });
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteColor = async (colorId: string) => {
    if (colorId) {
      await deleteColor(colorId);
    }
  };

  // Ordenar los colores alfabéticamente por nombre
  const sortedColors = colors?.slice().sort((a: Color, b: Color) =>
    a.name.localeCompare(b.name)
  );

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !colors) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch colors
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
            placeholder="Buscar colores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Colores" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Color
        </button>
      </div>

      {/* BODY COLORS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {sortedColors.map((color) => (
          <div
            key={color.colorId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              <h3 className="text-lg text-gray-900 font-semibold">
                {color.name}
              </h3>              
              <div className="flex mt-4">
                <button
                  className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
                  onClick={() => {
                    setSelectedColor(color);
                    setIsEditModalOpen(true);
                  }}
                >
                  <PencilIcon className="w-5 h-5 mr-2" /> Editar
                </button>
                <button
                  className="text-red-500 hover:text-red-700 flex items-center"
                  onClick={() => handleDeleteColor(color.colorId)}
                >
                  <TrashIcon className="w-5 h-5 mr-2" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <CreateColorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateColor}
      />

      {selectedColor && (
        <EditColorModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={handleEditColor}
          color={selectedColor}
        />
      )}
    </div>
  );
};

export default Colors;
