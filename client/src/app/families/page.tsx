"use client";

import { useState, useEffect } from "react";
import {
  useGetAuthUserQuery,
  useGetRolePermissionsByModuleQuery,
  useGetFamiliesQuery,
  useCreateFamilyMutation,
  useUpdateFamilyMutation,
  useDeleteFamilyMutation,
  useGetMakesQuery,
  PermissionPage,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import CreateFamilyModal from "./CreateFamilyModal";
import EditFamilyModal from "./EditFamilyModal";
import { Family } from "@/state/api";

const Families = () => {
  const { data: currentUser } = useGetAuthUserQuery({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [selectedMakeId, setSelectedMakeId] = useState<number | undefined>(undefined);
  const [roleId, setRoleId] = useState<string | undefined>(undefined);
  const [moduleName, setModuleName] = useState("Inventory");
  const [subModuleName, setSubModuleName] = useState("Familias");

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

  const { data: families, isLoading, isError } = useGetFamiliesQuery({ 
    search: searchTerm, 
    makeId: selectedMakeId 
  });
  const { data: makes = [] } = useGetMakesQuery();

  const userPermissions = permissionsData?.permissions || [];

  const [createFamily] = useCreateFamilyMutation();
  const [updateFamily] = useUpdateFamilyMutation();
  const [deleteFamily] = useDeleteFamilyMutation();

  // Establecer el primer make por defecto al cargar los datos
  useEffect(() => {
    if (makes.length > 0 && !selectedMakeId) {
      setSelectedMakeId(Number(makes[0].makeId));  // Selecciona el primer make por defecto
    }
  }, [makes, selectedMakeId]);

  const handleCreateFamily = async (familyData: Family) => {
    await createFamily(familyData);
    setIsCreateModalOpen(false);
  };

  const handleEditFamily = async (familyId: string, updatedData: Partial<Family>) => {
    if (familyId) {
      await updateFamily({ id: familyId, data: updatedData });
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteFamily = async (familyId: string) => {
    if (familyId) {
      await deleteFamily(familyId);
    }
  };

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !families) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch families
      </div>
    );
  }

  const transformPermissions = (userPermissions: String[]): PermissionPage => {
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

  return (
    <div className="mx-auto pb-5 w-full">
    {/* HEADER BAR */}
    <div className="flex justify-between items-center mb-6">
      <Header name="Familias" />
      {permissions.canAdd && (
      <button
        className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
        onClick={() => setIsCreateModalOpen(true)}
      >
        <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Familia
      </button>
      )}
    </div>
  
    {/* MAKE DROPDOWN */}
    <div className="mb-6">
      <label htmlFor="make" className="block text-sm font-medium text-gray-700">
        Filtrar por Fabricante:
      </label>
      <select
        id="make"
        name="make"
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={selectedMakeId}
        onChange={(e) => setSelectedMakeId(Number(e.target.value))}  // Actualiza el filtro al cambiar
      >
        {makes.map((make) => (
          <option key={make.makeId} value={make.makeId}>
            {make.name}
          </option>
        ))}
      </select>
    </div>

        {/* SEARCH BAR */}
        <div className="mb-6">
      <div className="flex items-center border-2 border-gray-200 rounded">
        <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
        <input
          className="w-full py-2 px-4 rounded bg-white"
          placeholder="Buscar familia..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  
    {/* BODY FAMILIES LIST */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
      {families.map((family) => (
        <div
          key={family.familyId}
          className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
        >
          <div className="flex flex-col items-center">
            <h3 className="text-lg text-gray-900 font-semibold">
              {family.name}
            </h3>
            {family.description && (
              <p className="text-gray-600">Descripción: {family.description}</p>
            )}
            {family.make?.name && (
              <p className="text-gray-600">Fabricante: {family.make.name}</p>
            )}
            <div className="flex mt-4">
            {permissions.canEdit && (
              <button
                className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
                onClick={() => {
                  setSelectedFamily(family);
                  setIsEditModalOpen(true);
                }}
              >
                <PencilIcon className="w-5 h-5 mr-2" /> Editar
              </button>
            )}
            {permissions.canDelete && (
              <button
                className="text-red-500 hover:text-red-700 flex items-center"
                onClick={() => handleDeleteFamily(family.familyId)}
              >
                <TrashIcon className="w-5 h-5 mr-2" /> Eliminar
              </button>
            )}
            </div>
          </div>
        </div>
      ))}
    </div>
  
    {/* MODALS */}
    <CreateFamilyModal
      isOpen={isCreateModalOpen}
      onClose={() => setIsCreateModalOpen(false)}
      onCreate={handleCreateFamily}
      makes={makes}
    />
  
    <EditFamilyModal
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      onEdit={handleEditFamily}
      selectedFamily={selectedFamily}
      makes={makes}
    />
  </div>
  
  );
};

export default Families;
