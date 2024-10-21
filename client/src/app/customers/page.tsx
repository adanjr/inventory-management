"use client";

import { useState } from "react";
import {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  NewCustomer,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import CreateCustomerModal from "./CreateCustomerModal";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Customer } from "@/state/api";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

  const { data: customers = [], isLoading, isError } = useGetCustomersQuery(searchTerm);
  const [createCustomer] = useCreateCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const handleCreateCustomer = async (customerData: NewCustomer) => {
    await createCustomer(customerData);
    setIsCreateModalOpen(false);
  };

  const handleEditCustomer = async (customerId: string, updatedData: Partial<Customer>) => {
    if (customerId) {
      await updateCustomer({ id: customerId, data: updatedData });
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (customerId) {
      await deleteCustomer(customerId);
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !customers) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch customers
      </div>
    );
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 30 },
    { field: "name", headerName: "Nombre", width: 150 },
    { field: "lastname", headerName: "Apellidos", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Teléfono", width: 150 },
    { field: "address", headerName: "Dirección", width: 200 },
    { field: "city", headerName: "Ciudad", width: 120 },
  ];

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Clientes" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Cliente
        </button>
      </div>

      {/* Customers DataGrid */}
      <div className="w-full">
        <DataGrid
          rows={customers}
          columns={columns}
          getRowId={(row) => row.customerId}
          checkboxSelection
          disableMultipleRowSelection
          className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
          onRowSelectionModelChange={(newRowSelectionModel) => setRowSelectionModel(newRowSelectionModel)}
          rowSelectionModel={rowSelectionModel}
        />
      </div>

      {/* MODALS */}
      <CreateCustomerModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateCustomer}
      />
    </div>
  );
};

export default Customers;
