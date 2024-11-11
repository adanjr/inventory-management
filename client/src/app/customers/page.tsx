"use client";

import { useEffect, useState } from "react";
import {
  useGetAuthUserQuery, 
  useGetRolePermissionsByModuleQuery,
  useGetColorsQuery,
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  NewCustomer,
  PermissionPage,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon, EditIcon, DeleteIcon, DownloadIcon, Eye } from "lucide-react";
import Header from "@/app/(components)/Header";
import CreateCustomerModal from "./CreateCustomerModal";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import * as XLSX from 'xlsx';
import { Customer } from "@/state/api";
import { useRouter } from 'next/navigation';

const Customers = () => {
  const { data: currentUser } = useGetAuthUserQuery({});
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [roleId, setRoleId] = useState<string | undefined>(undefined);
  const [moduleName, setModuleName] = useState("Catalogs");
  const [subModuleName, setSubModuleName] = useState("Todos");

  useEffect(() => {
    if (currentUser?.userDetails?.roleId) {
      setRoleId(currentUser.userDetails.roleId.toString());
    }
  }, [currentUser]);

  const { data: permissionsData, isLoading: permissionsLoading } = useGetRolePermissionsByModuleQuery(
    {
      roleId: roleId || "",  // Si roleId no está disponible, pasamos una cadena vacía o un valor adecuado
      moduleName,
      subModuleName,
    },
    { skip: !roleId }  // Esto evita la consulta cuando no tenemos roleId
  );

  const { data: customers = [], isLoading, isError } = useGetCustomersQuery(searchTerm);
  const [createCustomer] = useCreateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const userPermissions = permissionsData?.permissions || [];

  const handleCreateCustomer = async (customerData: NewCustomer) => {
    await createCustomer(customerData);
    setIsCreateModalOpen(false);
  };

  const handleDeleteCustomer = async () => {
    const selectedCustomerId = rowSelectionModel[0];
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        await deleteCustomer(String(selectedCustomerId));
        alert("Cliente eliminado con éxito.");
      } catch (error) {
        console.error("Error eliminando el cliente:", error);         
      }
    }
  };

  const transformPermissions = (userPermissions: string[]): PermissionPage => {
    return {      
      canAccess: userPermissions.includes("ACCESS"),
      canAdd: userPermissions.includes("ADD"),    
      canEdit: userPermissions.includes("EDIT"),    
      canDelete: userPermissions.includes("DELETE"),    
      canImport: userPermissions.includes("IMPORT"),    
      canExport: userPermissions.includes("EXPORT"),    
      canViewDetail: userPermissions.includes("VIEW_DETAIL"),    
    };
  };

  const permissions = transformPermissions(userPermissions);

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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(customers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
    XLSX.writeFile(workbook, "clientes.xlsx");
  };

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
      <Header name="Clientes" />

      <div className="mt-4 mb-6">
      <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>

      <div>
        <div className="flex space-x-4 mt-4">
          {permissions.canAdd && ( 
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Cliente
          </button> )}
          {permissions.canViewDetail && (
          <button
            className="flex items-center bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push(`/customers/detail/${rowSelectionModel[0]}`)}
            disabled={rowSelectionModel.length === 0}
          >
            <Eye className="w-5 h-5 mr-2" />
            Ver Detalle
          </button>
        )}
          {permissions.canEdit && (
            <button
              className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => router.push(`/customers/edit/${rowSelectionModel[0]}`)}
              disabled={rowSelectionModel.length === 0}
            >
              <EditIcon className="w-5 h-5 mr-2" />
              Editar Cliente
            </button>
          )}
          {permissions.canDelete && (
            <button
              className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleDeleteCustomer}
              disabled={rowSelectionModel.length === 0}
            >
              <DeleteIcon className="w-5 h-5 mr-2" />
              Eliminar Cliente
            </button>
          )}
          {permissions.canExport && (
            <button
              className="flex items-center bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              onClick={exportToExcel}
            >
              <DownloadIcon className="w-5 h-5 mr-2" />
              Exportar a Excel
            </button>
          )}

        </div>
      </div>
 
      {/* Customers DataGrid */}
      <div className="mt-6">
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
