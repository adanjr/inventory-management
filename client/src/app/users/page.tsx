"use client";

import { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";

// Datos simulados para usuarios
const fakeUsers = [
  { userId: 1, name: "Juan Pérez", email: "juan.perez@example.com", role: "Administrador" },
  { userId: 2, name: "María García", email: "maria.garcia@example.com", role: "Vendedor" },
  { userId: 3, name: "Carlos López", email: "carlos.lopez@example.com", role: "Gerente de Almacén" },
  { userId: 4, name: "Ana Sánchez", email: "ana.sanchez@example.com", role: "Vendedor" },
];

// Datos simulados para roles
const fakeRoles = [
  { roleId: 1, roleName: "Administrador", description: "Acceso completo al sistema." },
  { roleId: 2, roleName: "Vendedor", description: "Acceso a la gestión de ventas y clientes." },
  { roleId: 3, roleName: "Gerente de Almacén", description: "Acceso a la gestión de inventarios y almacenes." },
  { roleId: 4, roleName: "Supervisor", description: "Supervisión de procesos y reportes." },
];

// Columnas para la tabla de usuarios
const userColumns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 90 },
  { field: "name", headerName: "Nombre", width: 200 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "role", headerName: "Rol", width: 200 },
];

// Columnas para la tabla de roles
const roleColumns: GridColDef[] = [
  { field: "roleId", headerName: "ID", width: 90 },
  { field: "roleName", headerName: "Nombre del Rol", width: 200 },
  { field: "description", headerName: "Descripción", width: 300 },
];

const UsersAndRolesPage = () => {
  const [activeTab, setActiveTab] = useState("users"); // Estado para controlar la pestaña activa
  const [users, setUsers] = useState(fakeUsers); // Estado para usuarios
  const [roles, setRoles] = useState(fakeRoles); // Estado para roles

  // Función para manejar el cambio de pestaña
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Funciones CRUD simuladas para usuarios
  const handleCreateUser = () => {
    const newUser = { userId: Date.now(), name: "Nuevo Usuario", email: "nuevo.usuario@example.com", role: "Nuevo Rol" };
    setUsers([...users, newUser]);
  };

  const handleEditUser = (userId: number) => {
    const updatedUsers = users.map(user => user.userId === userId ? { ...user, name: "Usuario Editado" } : user);
    setUsers(updatedUsers);
  };

  const handleDeleteUser = (userId: number) => {
    const updatedUsers = users.filter(user => user.userId !== userId);
    setUsers(updatedUsers);
  };

  // Funciones CRUD simuladas para roles
  const handleCreateRole = () => {
    const newRole = { roleId: Date.now(), roleName: "Nuevo Rol", description: "Descripción del nuevo rol" };
    setRoles([...roles, newRole]);
  };

  const handleEditRole = (roleId: number) => {
    const updatedRoles = roles.map(role => role.roleId === roleId ? { ...role, roleName: "Rol Editado" } : role);
    setRoles(updatedRoles);
  };

  const handleDeleteRole = (roleId: number) => {
    const updatedRoles = roles.filter(role => role.roleId !== roleId);
    setRoles(updatedRoles);
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
          {/* Botones CRUD para Usuarios */}
          <div className="mb-4">
            <button
              onClick={handleCreateUser}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Crear Usuario
            </button>
            <button
              onClick={() => handleEditUser(users[0].userId)} // Edita el primer usuario como ejemplo
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Editar Usuario
            </button>
            <button
              onClick={() => handleDeleteUser(users[0].userId)} // Elimina el primer usuario como ejemplo
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Eliminar Usuario
            </button>
          </div>
          <DataGrid
            rows={users}
            columns={userColumns}
            getRowId={(row) => row.userId}
            checkboxSelection
            className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
          />
        </div>
      )}

      {/* Contenido de Roles */}
      {activeTab === "roles" && (
        <div>
          {/* Botones CRUD para Roles */}
          <div className="mb-4">
            <button
              onClick={handleCreateRole}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Crear Rol
            </button>
            <button
              onClick={() => handleEditRole(roles[0].roleId)} // Edita el primer rol como ejemplo
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Editar Rol
            </button>
            <button
              onClick={() => handleDeleteRole(roles[0].roleId)} // Elimina el primer rol como ejemplo
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Eliminar Rol
            </button>
          </div>
          <DataGrid
            rows={roles}
            columns={roleColumns}
            getRowId={(row) => row.roleId}
            checkboxSelection
            className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
          />
        </div>
      )}
    </div>
  );
};

export default UsersAndRolesPage;
