"use client";

import { useState } from "react";
import { 
  useGetManufacturersQuery, 
  useCreateManufacturerMutation, 
  useUpdateManufacturerMutation, 
  useDeleteManufacturerMutation } from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import CreateManufacturerModal from "./CreateManufacturerModal";
import EditManufacturerModal from "./EditManufacturerModal";
import { Manufacturer } from "@/state/api";

const Manufacturers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);

  const { data: manufacturers, isLoading, isError } = useGetManufacturersQuery(searchTerm);

  const [createManufacturer] = useCreateManufacturerMutation();
  const [updateManufacturer] = useUpdateManufacturerMutation();
  const [deleteManufacturer] = useDeleteManufacturerMutation();

  const handleCreateManufacturer = async (manufacturerData: Manufacturer) => {
    await createManufacturer(manufacturerData);
    setIsCreateModalOpen(false);
  };

  const handleEditManufacturer = async (manufacturerId: string, updatedData: Partial<Manufacturer>) => {
    if (manufacturerId) {
      await updateManufacturer({ id: manufacturerId, data: updatedData });
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteManufacturer = async (manufacturerId: string) => {
    if (manufacturerId) {
      await deleteManufacturer(manufacturerId);
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !manufacturers) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch manufacturers
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
            placeholder="Buscar Marcas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Marcas" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear
          Marcas
        </button>
      </div>

      {/* BODY MANUFACTURERS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {manufacturers.map((manufacturer) => (
          <div
            key={manufacturer.manufacturer_id}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              <h3 className="text-lg text-gray-900 font-semibold">
                {manufacturer.name}
              </h3>
              <p className="text-gray-800">Pais: {manufacturer.country}</p>
              {manufacturer.contact_info && (
                <div className="text-sm text-gray-600 mt-1">
                  Contacto: {manufacturer.contact_info}
                </div>
              )}
              <div className="flex mt-4">
                <button
                  className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
                  onClick={() => {
                    setSelectedManufacturer(manufacturer);
                    setIsEditModalOpen(true);
                  }}
                >
                  <PencilIcon className="w-5 h-5 mr-2" /> Editar
                </button>
                <button
                  className="text-red-500 hover:text-red-700 flex items-center"
                  onClick={() => handleDeleteManufacturer(manufacturer.manufacturer_id)}
                >
                  <TrashIcon className="w-5 h-5 mr-2" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <CreateManufacturerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateManufacturer}
      />
      {selectedManufacturer && (
        <EditManufacturerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          manufacturerId = {selectedManufacturer.manufacturer_id}        
        />
      )}
    </div>
  );
};

export default Manufacturers;
