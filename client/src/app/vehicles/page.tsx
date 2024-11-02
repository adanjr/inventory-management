// page.tsx
"use client";

import { useGetVehiclesQuery, useGetLocationsQuery, useGetAuthUserQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import VehiclesGrid from "@/app/(components)/Vehicles/VehiclesGrid";
import { useState } from "react";

const rolePermissions = {
  ADMINISTRADOR: {
    canAddVehicle: true,
    canEditVehicle: true,
    canDeleteVehicle: true,
    canImportVehicles: true,
    canExportVehicles: true,
    canViewVehicleDetail: true,
  },
  VENDEDOR: {
    canAddVehicle: false,
    canEditVehicle: true,
    canDeleteVehicle: false,
    canImportVehicles: false,
    canExportVehicles: true,
    canViewVehicleDetail: true,
  },
  ALMACENISTA: {
    canAddVehicle: false,
    canEditVehicle: false,
    canDeleteVehicle: false,
    canImportVehicles: true,
    canExportVehicles: true,
    canViewVehicleDetail: true,
  },
};

const Vehicles = () => {
  const { data: currentUser } = useGetAuthUserQuery({});
  const { data: locations = [], isLoading: locationsLoading } = useGetLocationsQuery();
  const { data: vehicles, isError, isLoading } = useGetVehiclesQuery("%");

  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading || locationsLoading) return <div>Cargando...</div>;
  if (isError || !vehicles) return <div>Fallo al cargar vehículos</div>;

  const currentUserRole = currentUser?.userDetails?.roleName || "NO ROLE";
  const userPermissions = rolePermissions[currentUserRole as keyof typeof rolePermissions] || {
    canAddVehicle: false,
    canEditVehicle: false,
    canDeleteVehicle: false,
    canImportVehicles: false,
    canExportVehicles: false,
  };

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.internal_serial?.toLowerCase().includes(searchTerm.toLowerCase())
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
      
      <VehiclesGrid vehicles={filteredVehicles} locations={locations} role={currentUserRole} permissions={userPermissions} />
    </div>
  );
};

export default Vehicles;
