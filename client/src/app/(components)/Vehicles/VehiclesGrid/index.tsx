// src/app/(components)/VehiclesGrid.tsx
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { PlusCircleIcon, EditIcon, DeleteIcon, UploadIcon, DownloadIcon, Eye } from "lucide-react";
import ImportVehiclesModal from "./ImportVehicles";
import * as XLSX from 'xlsx';
import { useDeleteVehicleMutation,
         PermissionPage, 
         Vehicle } from "@/state/api";

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
  permissions: string[]; 
}

const VehiclesGrid: React.FC<VehiclesGridProps> = ({ vehicles, locations, role, permissions }) => {
  const router = useRouter();
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<number | string>("");

  const transformPermissions = (permissionsArray: string[]): PermissionPage => {
    return {
      canAccess: permissionsArray.includes("ACCESS"),
      canAdd: permissionsArray.includes("ADD"),
      canEdit: permissionsArray.includes("EDIT"),
      canDelete: permissionsArray.includes("DELETE"),
      canImport: permissionsArray.includes("IMPORT"),
      canExport: permissionsArray.includes("EXPORT"),
      canViewDetail: permissionsArray.includes("VIEW_DETAIL"),
    };
  };

  const [deleteVehicle] = useDeleteVehicleMutation();

  // Transformar los permisos a booleanos
  const userPermissions = transformPermissions(permissions);

  const handleDelete = async () => {
    const selectedVehicleId = rowSelectionModel[0];
    if (window.confirm("¿Estás seguro de que deseas eliminar este vehículo?")) {
      try {
        await deleteVehicle(String(selectedVehicleId));
        alert("Vehiculo eliminado con éxito.");
      } catch (error) {
        console.error("Error eliminando el vehiculo:", error);         
      }
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
        {userPermissions.canAdd && (
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push("/vehicles/create")}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Agregar Vehículo
          </button>
        )}
        {userPermissions.canViewDetail && (
          <button
            className="flex items-center bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push(`/vehicles/detail/${rowSelectionModel[0]}`)}
            disabled={rowSelectionModel.length === 0}
          >
            <Eye className="w-5 h-5 mr-2" />
            Ver Detalle
          </button>
        )}
        {userPermissions.canEdit && (
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push(`/vehicles/edit/${rowSelectionModel[0]}`)}
            disabled={rowSelectionModel.length === 0}
          >
            <EditIcon className="w-5 h-5 mr-2" />
            Editar Vehículo
          </button>
        )}
        {userPermissions.canDelete && (
          <button
            className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleDelete}
            disabled={rowSelectionModel.length === 0}
          >
            <DeleteIcon className="w-5 h-5 mr-2" />
            Eliminar Vehículo
          </button>
        )}
        {userPermissions.canAdd && (
          <button
            className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            <UploadIcon className="w-5 h-5 mr-2" />
            Importar
          </button>
        )}
        {userPermissions.canExport && (
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
