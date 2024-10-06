"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useGetVehiclesQuery, Vehicle } from "@/state/api";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import { PlusCircleIcon, EditIcon, DeleteIcon } from "lucide-react";

// Formato de moneda para México
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
};

const columns: GridColDef[] = [
  { field: "vehicleId", headerName: "ID", width: 30 },
  { field: "vin", headerName: "VIN", width: 150 },
  { field: "Serial", headerName: "Serial", width: 150 },
  { field: "stockNumber", headerName: "Stock Number", width: 150 },
  { field: "makeName", headerName: "Fabricante", width: 100 },
  { field: "modelName", headerName: "Modelo", width: 100 },
  { field: "colorName", headerName: "Color", width: 100 },
  { field: "year", headerName: "Año", width: 40 },
  { field: "price", headerName: "Precio", width: 100, type: "number" },
];

const Vehicles = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("%");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

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

  const isSelectionEmpty = rowSelectionModel.length === 0;

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
  {/* Header alineado a la izquierda */}
  <div className="flex-grow">
    <Header name="Vehículos" />
  </div>

  {/* Contenedor para los botones alineados a la derecha */}
  <div className="flex space-x-4 ml-auto">
    <button
      className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => router.push("/vehicles/create")}
    >
      <PlusCircleIcon className="w-5 h-5 mr-2" />
      Agregar Vehículo
    </button>
    <button
      className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => router.push(`/vehicles/edit/${rowSelectionModel[0]}`)} // Usar el ID de la fila seleccionada
      disabled={isSelectionEmpty} // Deshabilitado si no hay filas seleccionadas
    >
      <EditIcon className="w-5 h-5 mr-2" />
      Editar Vehículo
    </button>
    <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push("/vehicles/delete")}
            disabled={isSelectionEmpty} // Deshabilitado si no hay filas seleccionadas
          >
            <DeleteIcon className="w-5 h-5 mr-2" />
            Eliminar Vehículo
    </button>
  </div>
    </div>

      {/* Vehicles DataGrid */}
      <div className="w-full">
        <DataGrid
          rows={vehicles}
          columns={columns}
          getRowId={(row) => row.vehicleId}
          checkboxSelection
          disableMultipleRowSelection
          className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
          onRowSelectionModelChange={(newRowSelectionModel) => setRowSelectionModel(newRowSelectionModel)}
          rowSelectionModel={rowSelectionModel} // Pasa el estado de selección de filas al DataGrid
        />
      </div>
    </div>
  );
};

export default Vehicles;