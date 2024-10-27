"use client";

import { useState } from "react";
import { useGetUsersQuery, useGetRolesQuery, NewUser, useCreateUserMutation, Role, useCreateRoleMutation, NewRole, User } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import CreateUserModal from "./CreateUserModal";
import CreateRoleModal from "./CreateRoleModal";
import { PlusCircleIcon } from "lucide-react";

// Columnas para la tabla de usuarios
const userColumns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 90 },
  { field: "username", headerName: "UserName", width: 200 },
  { field: "name", headerName: "Nombre", width: 200 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "roleName", headerName: "Rol", width: 200 },
  { field: "locationName", headerName: "Ubicacion", width: 200 },
];

// Columnas para la tabla de roles
const roleColumns: GridColDef[] = [
  { field: "roleId", headerName: "ID", width: 90 },
  { field: "name", headerName: "Nombre del Rol", width: 200 },
];

const UsersAndRolesPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: roles = [], isLoading: rolesLoading } = useGetRolesQuery();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [createUser] = useCreateUserMutation();
  const [createRole] = useCreateRoleMutation();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

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

  const handleCreateRole = async (roleData: NewRole) => {
    await createRole(roleData);
    setIsCreateRoleModalOpen(false);
  };

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
            <button
              className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Usuario 
              </button>
          </div>
          <DataGrid
            rows={users}
            columns={userColumns}
            getRowId={(row) => row.userId}
            checkboxSelection
            loading={usersLoading}
            className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
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
              onClick={() => setIsCreateRoleModalOpen(true)}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Rol 
              </button>
          </div>
          <DataGrid
            rows={roles}
            columns={roleColumns}
            getRowId={(row) => row.roleId}
            checkboxSelection
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

      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
        onCreate={handleCreateRole}            
      />
    </div>
  );
};

export default UsersAndRolesPage;
