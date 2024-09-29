"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useGetVehiclesQuery, Vehicle } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import { PlusCircleIcon } from "lucide-react";

// Formato de moneda para México
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
};

const columns: GridColDef[] = [
  { field: "vehicleId", headerName: "ID", width: 90 },
  { field: "vin", headerName: "VIN", width: 150 },
  { field: "makeId", headerName: "Fabricante", width: 150 },
  { field: "modelId", headerName: "Modelo", width: 150 },
  { field: "year", headerName: "Año", width: 100 },
  { field: "price", headerName: "Precio", width: 150, type: "number" },
];


const Vehicles = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("%");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data: vehicles, isError, isLoading } = useGetVehiclesQuery(debouncedSearchTerm || undefined);

  if (isLoading) return <div>Cargando...</div>;
  if (isError || !vehicles) return <div>Fallo al cargar vehículos</div>;

  return (
    <div className="mx-auto pb-5 w-full">
      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Buscar vehículos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Vehículos" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => router.push("/vehicles/create")}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Agregar Vehículo
        </button>
      </div>

      {/* Vehicles DataGrid */}
      <div className="w-full">
        <DataGrid
          rows={vehicles}
          columns={columns}
          getRowId={(row) => row.vehicleId}
          checkboxSelection
          className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
        />
      </div>
    </div>
  );
};

export default Vehicles;