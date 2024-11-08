"use client";

import { useEffect, useState } from "react";
import {
  useGetAuthUserQuery, 
  useGetRolePermissionsByModuleQuery,
  useGetBatteryWarrantiesQuery,
  useCreateBatteryWarrantyMutation,
  useUpdateBatteryWarrantyMutation,
  useDeleteBatteryWarrantyMutation,
  PermissionPage,
} from "@/state/api";
import useAccessControl from "@/app/security/useAccessControl";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import CreateBatteryWarrantyModal from "./CreateBatteryWarrantyModal";
import EditBatteryWarrantyModal from "./EditBatteryWarrantyModal";
import { BatteryWarranty } from "@/state/api";
import { useRouter } from 'next/navigation';

const Warranties = () => {
  const { data: currentUser } = useGetAuthUserQuery({});
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBatteryWarranty, setSelectedBatteryWarranty] = useState<BatteryWarranty | null>(null);
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

  const { data: batteryWarranties, isLoading, isError } = useGetBatteryWarrantiesQuery("");
  const [createBatteryWarranty] = useCreateBatteryWarrantyMutation();
  const [updateBatteryWarranty] = useUpdateBatteryWarrantyMutation();
  const [deleteBatteryWarranty] = useDeleteBatteryWarrantyMutation();

  const userPermissions = permissionsData?.permissions || [];

  const handleCreateBatteryWarranty = async (batteryWarrantyData: BatteryWarranty) => {
    await createBatteryWarranty(batteryWarrantyData);
    setIsCreateModalOpen(false);
  };

  const handleEditBatteryWarranty = async (batteryWarrantyId: string, updatedData: Partial<BatteryWarranty>) => {
    if (batteryWarrantyId) {
      await updateBatteryWarranty({ id: batteryWarrantyId, data: updatedData });
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteBatteryWarranty = async (batteryWarrantyId: string) => {
    if (batteryWarrantyId) {
      await deleteBatteryWarranty(batteryWarrantyId);
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

  // Filtrar y ordenar garantías
  const filteredAndSortedBatteryWarranties = batteryWarranties
    ?.filter((batteryWarranty) =>
      batteryWarranty.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.description?.localeCompare(b.description || '') || 0); // Ordenar alfabéticamente por 'description'

  if (isLoading) {
    return <div className="py-4">Cargando...</div>;
  }

  if (isError || !batteryWarranties) {
    return (
      <div className="text-center text-red-500 py-4">
        Error al obtener las garantías
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
            placeholder="Buscar garantías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Garantías de Baterías" />
        {permissions.canAdd && ( 
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Garantía de Batería
        </button>
        )}
      </div>

      {/* BODY WARRANTIES LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {filteredAndSortedBatteryWarranties?.map((batteryWarranty) => (
          <div
            key={batteryWarranty.batteryWarrantyId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              <h3 className="text-lg text-gray-900 font-semibold">
                Nombre: {batteryWarranty.name}
              </h3>
              <p className="text-gray-800">Descripción: {batteryWarranty.description} </p>         
              <p className="text-gray-800">Duración: {batteryWarranty.durationMonths} meses</p>                        
              <div className="flex mt-4">
              {permissions.canEdit && ( 
                <button
                  className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
                  onClick={() => {
                    setSelectedBatteryWarranty(batteryWarranty);
                    setIsEditModalOpen(true);
                  }}
                >
                  <PencilIcon className="w-5 h-5 mr-2" /> Editar
                </button>
              )}
              {permissions.canDelete && ( 
                <button
                  className="text-red-500 hover:text-red-700 flex items-center"
                  onClick={() => handleDeleteBatteryWarranty(batteryWarranty.batteryWarrantyId)}
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
      <CreateBatteryWarrantyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateBatteryWarranty}
      />

      <EditBatteryWarrantyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditBatteryWarranty}
        selectedBatteryWarranty={selectedBatteryWarranty}
      />
    </div>
  );
};

export default Warranties;
