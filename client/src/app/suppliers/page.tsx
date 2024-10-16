"use client";

import { useState } from "react";
import {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation } from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import CreateSupplierModal from "./CreateSupplierModal";
 
import { Supplier } from "@/state/api";
import EditSupplierModal from "./EditSupplierModal";

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const { data: suppliers, isLoading, isError } = useGetSuppliersQuery(searchTerm);

  const [createSupplier] = useCreateSupplierMutation();
  const [updateSupplier] = useUpdateSupplierMutation();
  const [deleteSupplier] = useDeleteSupplierMutation();

  const handleCreateSupplier = async (supplierData: Supplier) => {
    await createSupplier(supplierData);
    setIsCreateModalOpen(false);
  };

  const handleEditSupplier = async (supplierId: string, updatedData: Partial<Supplier>) => {
    if (supplierId) {
      await updateSupplier({ id: supplierId, data: updatedData });
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    if (supplierId) {
      await deleteSupplier(supplierId);
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !suppliers) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch suppliers
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
          placeholder="Buscar proveedores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>

    {/* HEADER BAR */}
    <div className="flex justify-between items-center mb-6">
      <Header name="Proveedores" />
      <button
        className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
        onClick={() => setIsCreateModalOpen(true)}
      >
        <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Proveedor
      </button>
    </div>

    {/* BODY SUPPLIERS LIST */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {suppliers.map((supplier) => (
        <div
          key={supplier.supplierId}
          className="border shadow rounded-md p-4 w-full mx-auto"
        >
          <div className="flex flex-col">
            <h3 className="text-lg text-gray-900 font-semibold">
              {supplier.name}
            </h3>
            <p className="text-gray-800">Email: {supplier.email}</p>
            {supplier.phone && (
              <p className="text-gray-800">Phone: {supplier.phone}</p>
            )}
            {supplier.address && (
              <div className="text-sm text-gray-600 mt-1">
                Dirección: {supplier.address}, {supplier.city}, {supplier.state}, {supplier.country}, {supplier.postalCode}
              </div>
            )}
            <div className="flex mt-4">
              <button
                className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
                onClick={() => {
                  setSelectedSupplier(supplier);
                  setIsEditModalOpen(true);
                }}
              >
                <PencilIcon className="w-5 h-5 mr-2" /> Editar
              </button>
              <button
                className="text-red-500 hover:text-red-700 flex items-center"
                onClick={() => handleDeleteSupplier(supplier.supplierId)}
              >
                <TrashIcon className="w-5 h-5 mr-2" /> Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* MODALS */}
    <CreateSupplierModal
      isOpen={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
      onCreate={handleCreateSupplier}
    />
    
    <EditSupplierModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditSupplier}
        selectedSupplier={selectedSupplier}
      />
  </div>
);

};

export default Suppliers;
