"use client";

import {  useGetVehiclesQuery, 
          useGetLocationsQuery, 
          useGetAuthUserQuery, 
          useGetRolePermissionsByModuleQuery,
           } from "@/state/api";
import Header from "@/app/(components)/Header";
import VehiclesGrid from "@/app/(components)/Vehicles/VehiclesGrid";
import { useState, useEffect } from "react";

const Vehicles = () => {
  const { data: currentUser } = useGetAuthUserQuery({});
  const { data: locations = [], isLoading: locationsLoading } = useGetLocationsQuery();
  const { data: vehicles, isError, isLoading } = useGetVehiclesQuery("%");

  const [searchTerm, setSearchTerm] = useState("");
  const [roleId, setRoleId] = useState<string | undefined>(undefined);
  const [moduleName, setModuleName] = useState("Inventory");
  const [subModuleName, setSubModuleName] = useState("Vehiculos");

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

  if (isLoading || locationsLoading) return <div>Cargando...</div>;
  if (isError || !vehicles) return <div>Fallo al cargar vehículos</div>;
 
if (permissionsLoading) return <div>Cargando permisos...</div>;

const userPermissions = permissionsData?.permissions || [];
  
const filteredVehicles = vehicles.filter((vehicle) =>
  [
    vehicle.internal_serial,
    vehicle.engineNumber,
    vehicle.stockNumber,
    vehicle.makeName,
    vehicle.modelName,
    vehicle.locationName,
    vehicle.colorName,
  ]
    .some((field) =>
      field?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
);

  return (
    <div className="mx-auto pb-5 w-full">
      <Header name="Vehículos" />

      <div className="mt-4 mb-6">
        <input
          type="text"
          placeholder="Buscar vehículo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>
      
      <VehiclesGrid 
            vehicles={filteredVehicles} 
            locations={locations} 
            role={currentUser?.userDetails?.roleName || "NO ROLE"}
            permissions={userPermissions} />
    </div>
  );
};

export default Vehicles;
