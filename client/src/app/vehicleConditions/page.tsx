"use client";

import { useEffect, useState } from "react";
import {
  useGetAuthUserQuery, 
  useGetRolePermissionsByModuleQuery,
  useGetVehicleConditionsQuery,
  useCreateVehicleConditionMutation,
  useUpdateVehicleConditionMutation,
  useDeleteVehicleConditionMutation,
  PermissionPage,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import CreateVehicleConditionModal from "./CreateVehicleConditionModal";
import EditVehicleConditionModal from "./EditVehicleConditionModal";
import { VehicleCondition } from "@/state/api";
import { useRouter } from 'next/navigation';

const VehicleConditions = () => {
  const { data: currentUser } = useGetAuthUserQuery({});
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<VehicleCondition | null>(null);
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

  const { data: vehicleConditions, isLoading, isError } = useGetVehicleConditionsQuery("");
  const [createVehicleCondition] = useCreateVehicleConditionMutation();
  const [updateVehicleCondition] = useUpdateVehicleConditionMutation();
  const [deleteVehicleCondition] = useDeleteVehicleConditionMutation();

  const userPermissions = permissionsData?.permissions || [];

  const handleCreateVehicleCondition = async (conditionData: VehicleCondition) => {
    await createVehicleCondition(conditionData);
    setIsCreateModalOpen(false);
  };

  const handleEditVehicleCondition = async (conditionId: string, updatedData: Partial<VehicleCondition>) => {
    if (conditionId) {
      await updateVehicleCondition({ id: conditionId, data: updatedData });
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteVehicleCondition = async (conditionId: string) => {
    if (conditionId) {
      await deleteVehicleCondition(conditionId);
    }
  };

  // Filtrar y ordenar condiciones
  const filteredAndSortedConditions = vehicleConditions
    ?.filter((condition) =>
      condition.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente por 'name'

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !vehicleConditions) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch vehicle conditions
      </div>
    );
  }

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

    if (!permissions.canAccess) {
      router.push('/accessDenied');  
    }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Buscar condiciones de vehículos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Condiciones de Vehículos" />
        {permissions.canAdd && ( 
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Condición
        </button> )}
      </div>

      {/* BODY VEHICLE CONDITIONS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {filteredAndSortedConditions?.map((condition) => (
          <div
            key={condition.conditionId}
            className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
          >
            <div className="flex flex-col items-center">
              <h3 className="text-lg text-gray-900 font-semibold">
                {condition.name}
              </h3>            
              <div className="flex mt-4">
              {permissions.canEdit && ( 
                <button
                  className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
                  onClick={() => {
                    setSelectedCondition(condition);
                    setIsEditModalOpen(true);
                  }}
                >
                  <PencilIcon className="w-5 h-5 mr-2" /> Editar
                </button> )}
                {permissions.canDelete && ( 
                <button
                  className="text-red-500 hover:text-red-700 flex items-center"
                  onClick={() => handleDeleteVehicleCondition(condition.conditionId)}
                >
                  <TrashIcon className="w-5 h-5 mr-2" /> Eliminar
                </button> )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <CreateVehicleConditionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateVehicleCondition}
      />

      <EditVehicleConditionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditVehicleCondition}
        selectedCondition={selectedCondition}
      />
    </div>
  );
};

export default VehicleConditions;
