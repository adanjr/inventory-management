"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useGetUsersQuery, 
         useGetRolesQuery,          
         useCreateUserMutation,   
         useUpdateUserMutation,  
         NewUser,         
         User, 
         useDeleteUserMutation} from "@/state/api";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import CreateUserModal from "@/app/users/modals/CreateUserModal";
import { PlusCircleIcon, EditIcon, Ban } from "lucide-react";

// Columnas para la tabla de usuarios
const userColumns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 30 },
  { field: "username", headerName: "UserName", width: 100 },
  { field: "name", headerName: "Nombre", width: 180 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "roleName", headerName: "Rol", width: 150 },
  { field: "locationName", headerName: "Ubicacion", width: 180 },
  { field: "isActive", headerName: "Activo", width: 180 },
];

const UsersAndRolesPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: roles = [], isLoading: rolesLoading } = useGetRolesQuery();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const isSelectionEmpty = rowSelectionModel.length === 0;

  const handleCreateUser = async (newUserData: NewUser) => {
    try {

      const userData = {
        ...newUserData,
        locationId: newUserData.locationId, // makeId is already number type
        roleId: newUserData.roleId, // familyId is already number type
      };

      await createUser(userData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleEdit = (roleId: string) => {
    router.push(`/users/roles/edit/${roleId}`)
  };  

 const handleDisable = async () => {
      const selectedUserId = rowSelectionModel[0];
      const selectedUser = users.find(user => user.userId === selectedUserId);

      if (!selectedUser) {
        alert("Usuario no encontrado.");
        return;
      }

      if (!selectedUser.isActive) {
        alert("Este usuario ya está desactivado.");
        return;
      }
    
      if (window.confirm(`¿Estás seguro de que deseas desactivar el usuario ${selectedUserId}?`)) {
        try {
          await deleteUser(String(selectedUserId));
          alert("Usuario desactivado con éxito.");
        } catch (error) {
          console.error("Error desactivando el usuario:", error);         
        }
      }
    };

  // Columnas para la tabla de roles
  const roleColumns: GridColDef[] = [
    { field: "roleId", headerName: "ID", width: 90 },
    { field: "name", headerName: "Nombre del Rol", width: 200 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params) => (
        <button
          onClick={() => handleEdit(params.row.roleId)}
          className="text-blue-500 hover:underline"
        >
          Editar
        </button>
      ),
      },
    ];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <Header name="Gestión de Usuarios y Roles" />

      {/* Pestañas */}
      <div className="flex space-x-4 mb-4 border-b border-gray-200">
        <button
          className={`py-2 px-4 ${activeTab === "users" ? "border-b-2 border-blue-500 font-semibold" : "text-gray-500"}`}
          onClick={() => handleTabChange("users")}
        >
          Usuarios
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "roles" ? "border-b-2 border-blue-500 font-semibold" : "text-gray-500"}`}
          onClick={() => handleTabChange("roles")}
        >
          Roles
        </button>
      </div>
      {/* Contenido de Usuarios */}
      {activeTab === "users" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <Header name="Usuarios" />                    
          </div>
          <div className="flex space-x-4 mt-4">
          <button
              className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Usuario 
          </button>      
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push(`/users/edit/${rowSelectionModel[0]}`)}
            disabled={isSelectionEmpty}
          >
            <EditIcon className="w-5 h-5 mr-2" />
            Editar Usuario
          </button>
          <button
            className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleDisable}
            disabled={isSelectionEmpty}
          >
            <Ban className="w-5 h-5 mr-2" />
            Desactivar Usuario
          </button>
           
        </div>
          <DataGrid
            rows={users}
            columns={userColumns}
            getRowId={(row) => row.userId}      
            loading={usersLoading}
            disableMultipleRowSelection
            className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
            onRowSelectionModelChange={(newRowSelectionModel) => setRowSelectionModel(newRowSelectionModel)}
            rowSelectionModel={rowSelectionModel}
          />
        </div>
      )}

      {/* Contenido de Roles */}
      {activeTab === "roles" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <Header name="Roles" />
            <button
              className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
              onClick={() => router.push("/users/roles/create")}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Rol 
              </button>             
          </div>
          <DataGrid
            rows={roles}
            columns={roleColumns}
            getRowId={(row) => row.roleId}             
            loading={rolesLoading}
            className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
          />
        </div>
      )}

       {/* MODALS */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateUser} />       
      
    </div>
  );
};

export default UsersAndRolesPage;