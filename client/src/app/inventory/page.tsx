"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useGetVehiclesCountByLocationQuery } from "@/state/api"; // Asegúrate de que esta consulta existe
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";

const columns: GridColDef[] = [
  { field: "locationName", headerName: "Ubicación", width: 200 },
  { field: "vehicleCount", headerName: "Total de Vehículos", width: 150 },
];

const Inventory = () => {
  const router = useRouter();
  const { data: vehicleCounts, isError, isLoading } = useGetVehiclesCountByLocationQuery();

  if (isLoading) return <div>Cargando...</div>;
  if (isError || !vehicleCounts) return <div>Fallo al cargar el conteo de vehículos por ubicación</div>;

  // Transformar los datos para que se adapten al DataGrid
  const rows = vehicleCounts.map(location => ({
    id: location.locationId, // Asigna un ID único para cada fila
    locationName: location.locationName,
    vehicleCount: location.count,
  }));

  return (
    <div className="mx-auto pb-5 w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col">
        <div className="flex justify-between items-center">
          <Header name="Inventario General de Vehículos por Ubicación" />
        </div>
      </div>

      {/* Inventory DataGrid */}
      <div className="w-full">
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
          autoHeight // Ajusta la altura automáticamente
        />
      </div>
    </div>
  );
};

export default Inventory;
