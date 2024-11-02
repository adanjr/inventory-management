// src/app/(components)/VehiclesGrid.tsx
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { PlusCircleIcon, EditIcon, DeleteIcon, UploadIcon, DownloadIcon, Eye } from "lucide-react";
import ImportVehiclesModal from "./ImportVehicles";
import * as XLSX from 'xlsx';
import { Vehicle } from "@/state/api";

// Formato de moneda para México
const formatCurrency = (value: number | null | undefined) => {
  if (value == null || isNaN(value)) {
    return "$0.00";
  }
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
};

const columns: GridColDef[] = [
  { field: "vehicleId", headerName: "ID", width: 30 },
  { field: "internal_serial", headerName: "Serial", width: 150 },
  { field: "engineNumber", headerName: "Número de Motor", width: 150 },
  { field: "stockNumber", headerName: "Stock Number", width: 150 },
  { field: "makeName", headerName: "Fabricante", width: 100 },
  { field: "familyName", headerName: "Familia", width: 100 },
  { field: "modelName", headerName: "Modelo", width: 100 },
  { field: "locationName", headerName: "Ubicacion", width: 100 },
  { field: "colorName", headerName: "Color", width: 100 },
  { field: "year", headerName: "Año", width: 40 },
  {
    field: "price",
    headerName: "Precio",
    width: 100,
    type: "number",
    valueFormatter: (params) => formatCurrency(params),
  },
  { field: "availabilityStatusName", headerName: "Disponibilidad", width: 100 },
];

interface VehiclesGridProps {
  vehicles: Vehicle[];
  locations: any[];
  role: string;
  permissions: {
    canAddVehicle: boolean;
    canEditVehicle: boolean;
    canDeleteVehicle: boolean;
    canImportVehicles: boolean;
    canExportVehicles: boolean;
    canViewVehicleDetail: boolean;
  };
}

const VehiclesGrid: React.FC<VehiclesGridProps> = ({ vehicles, locations, role, permissions }) => {
  const router = useRouter();
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<number | string>("");

  const handleDelete = () => {
    const selectedVehicleId = rowSelectionModel[0];
    if (window.confirm("¿Estás seguro de que deseas eliminar este vehículo?")) {
      // Lógica para eliminar el vehículo
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(vehicles);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehículos");
    XLSX.writeFile(workbook, "vehiculos.xlsx");
  };

  return (
    <div>
      <div className="flex space-x-4 mt-4">
        {permissions.canAddVehicle && (
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push("/vehicles/create")}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Agregar Vehículo
          </button>
        )}
        {permissions.canViewVehicleDetail && (
          <button
            className="flex items-center bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push(`/vehicles/detail/${rowSelectionModel[0]}`)}
            disabled={rowSelectionModel.length === 0}
          >
            <Eye className="w-5 h-5 mr-2" />
            Ver Detalle
          </button>
        )}
        {permissions.canEditVehicle && (
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push(`/vehicles/edit/${rowSelectionModel[0]}`)}
            disabled={rowSelectionModel.length === 0}
          >
            <EditIcon className="w-5 h-5 mr-2" />
            Editar Vehículo
          </button>
        )}
        {permissions.canDeleteVehicle && (
          <button
            className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleDelete}
            disabled={rowSelectionModel.length === 0}
          >
            <DeleteIcon className="w-5 h-5 mr-2" />
            Eliminar Vehículo
          </button>
        )}
        {permissions.canImportVehicles && (
          <button
            className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            <UploadIcon className="w-5 h-5 mr-2" />
            Importar
          </button>
        )}
        {permissions.canExportVehicles && (
          <button
            className="flex items-center bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            onClick={exportToExcel}
          >
            <DownloadIcon className="w-5 h-5 mr-2" />
            Exportar a Excel
          </button>
        )}
      </div>

      {/* Espacio entre botones y el grid */}
      <div className="mt-6">
        <DataGrid
          rows={vehicles}
          columns={columns}
          getRowId={(row) => row.vehicleId}
          checkboxSelection
          onRowSelectionModelChange={(newSelection) => setRowSelectionModel(newSelection)}
          rowSelectionModel={rowSelectionModel}
        />
      </div>

      <ImportVehiclesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        locations={locations}
        selectedLocationId={selectedLocationId}
        setSelectedLocationId={setSelectedLocationId}
      />
    </div>
  );
};

export default VehiclesGrid;
