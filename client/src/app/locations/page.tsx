"use client";

import { useEffect, useState } from "react";
import { 
  useGetAuthUserQuery, 
  useGetRolePermissionsByModuleQuery,
  useGetLocationsQuery, 
  useCreateLocationMutation, 
  useUpdateLocationMutation, 
  useDeleteLocationMutation,
  PermissionPage,
 } from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import { MapContainer, TileLayer, Marker } from 'react-leaflet'; 
import Header from "@/app/(components)/Header";
import CreateLocationModal from "./CreateLocationModal";
import { Location } from "@/state/api";
import { useRouter } from 'next/navigation';

const Locations = () => {
  const { data: currentUser } = useGetAuthUserQuery({});
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [roleId, setRoleId] = useState<string | undefined>(undefined);
  const [moduleName, setModuleName] = useState("Administration");
  const [subModuleName, setSubModuleName] = useState("Almacenes");

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

  const { data: locations, isLoading, isError } = useGetLocationsQuery(searchTerm);

  const [createLocation] = useCreateLocationMutation();
  const [updateLocation] = useUpdateLocationMutation();
  const [deleteLocation] = useDeleteLocationMutation();

  const userPermissions = permissionsData?.permissions || [];

  const handleCreateLocation = async (locationData: Location) => {
    await createLocation(locationData);
    setIsCreateModalOpen(false);
  };

  const handleDeleteLocation = async (locationId: string) => {
    if (locationId) {
      await deleteLocation(locationId);
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

  if (isError || !locations) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch locations
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
            placeholder="Buscar ubicaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Almacenes y Sucursales" />
        {permissions.canAdd && ( 
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear
          Ubicacion
        </button> )}
      </div>

      {/* BODY LOCATIONS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
      {locations.map((location) => (
        <div
          key={location.locationId}
          className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
        >
          <div className="flex flex-col items-center">
            <h3 className="text-lg text-gray-900 font-semibold">
              {location.name}
            </h3>
            <p className="text-gray-800">Tipo: {location.type}</p>
            {location.address && (
              <div className="text-sm text-gray-600 mt-1">
                Contact: {location.address}
              </div>
            )}

            <div className="flex mt-4">
            {permissions.canEdit && ( 
              <button
                className="text-blue-500 hover:text-blue-700 flex items-center mr-4"
                onClick={() => {
                  setSelectedLocation(location);
                  setIsEditModalOpen(true);
                }}
              >
                <PencilIcon className="w-5 h-5 mr-2" /> Editar
              </button> )}
              {permissions.canDelete && ( 
              <button
                className="text-red-500 hover:text-red-700 flex items-center"
                onClick={() => handleDeleteLocation(location.locationId)}
              >
                <TrashIcon className="w-5 h-5 mr-2" /> Eliminar
              </button> )}
            </div>
          </div>
        </div>
      ))}
    </div>

      {/* MODALS */}
      <CreateLocationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateLocation}
      />
      
    </div>
  );
};

export default Locations;
