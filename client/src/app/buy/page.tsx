"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useGetVehiclesQuery } from "@/state/api";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import { ShoppingCartIcon, CheckCircleIcon, UploadIcon } from "lucide-react"; 

// Formato de moneda para México
const formatCurrency = (value: number | null | undefined) => {
  if (value == null || isNaN(value)) {
    return "$0.00"; // Valor predeterminado si el precio es nulo o no es válido
  }
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
};

const columns: GridColDef[] = [
  { field: "vehicleId", headerName: "ID", width: 30 },
  { field: "vin", headerName: "VIN", width: 150 },
  { field: "internal_serial", headerName: "Serial", width: 150 },
  { field: "stockNumber", headerName: "Stock Number", width: 150 },
  { field: "makeName", headerName: "Fabricante", width: 100 },
  { field: "familyName", headerName: "Familia", width: 100 },
  { field: "modelName", headerName: "Modelo", width: 100 },
  { field: "colorName", headerName: "Color", width: 100 },
  { field: "year", headerName: "Año", width: 40 },
  {
    field: "price",
    headerName: "Precio",
    width: 100,
    type: "number",
    valueFormatter: (params) => {       
      return formatCurrency(params); // Usa la función para formatear la moneda
    },
  },
];

const Buy = () => {
  const router = useRouter();
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [providerName, setProviderName] = useState("");
  const [totalPurchase, setTotalPurchase] = useState(0);

  // Se eliminaron las consultas para obtener vehículos inicialmente
  const { data: vehicles = [], isError, isLoading } = useGetVehiclesQuery("%", { skip: true });

  const handlePurchase = async () => {
    if (rowSelectionModel.length === 0 || !providerName) {
      alert("Por favor selecciona al menos un vehículo y proporciona el nombre del proveedor.");
      return;
    }

    const selectedVehicleIds = rowSelectionModel; // Obtén todos los ID de vehículos seleccionados
    // Lógica para procesar la compra de vehículos...
    alert(`Compra procesada con éxito para los vehículos ID: ${selectedVehicleIds.join(", ")}, Proveedor: ${providerName}`);
    // Aquí podrías hacer una llamada a una API para guardar la compra, etc.
  };

  const handleUploadBatch = () => {
    alert("Carga de lote de vehículos en proceso..."); // Lógica para cargar el lote de vehículos
    // Puedes implementar aquí la funcionalidad para subir un archivo CSV o similar
  };

  return (
    <div className="mx-auto pb-5 w-full">
      {/* Header y barra de búsqueda */}
      <div className="mb-6 flex flex-col">
        <div className="flex justify-between items-center">
          <Header name="Compras" />
        </div>
        <div className="flex mb-4">
          <input
            className="w-3/4 py-2 px-4 border-2 border-gray-200 rounded"
            placeholder="Nombre del Proveedor"
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
          />
          <button className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <UploadIcon className="w-5 h-5" />
            Cargar Lote
          </button>
        </div>
      </div>

      {/* Título del DataGrid */}
      <div className="mb-2">
        <h2 className="text-xl font-bold">Vehículos a Comprar</h2>
      </div>

      {/* Vehicles DataGrid vacío */}
      <div className="w-full mb-4">
        <DataGrid
          rows={[]} // Mantener el grid vacío al inicio
          columns={columns}
          getRowId={(row) => row.vehicleId}
          checkboxSelection
          disableMultipleRowSelection
          className="bg-white shadow rounded-lg border border-gray-200"
          onRowSelectionModelChange={(newRowSelectionModel) => setRowSelectionModel(newRowSelectionModel)}
          rowSelectionModel={rowSelectionModel}
        />
      </div>

      {/* Total de compra en la esquina inferior derecha */}
      <div className="flex justify-end">
        <div className="bg-gray-200 p-4 rounded-lg shadow-lg text-lg">
          <strong>Total Compra: </strong>{formatCurrency(totalPurchase)}
        </div>
      </div>

      {/* Botones de compra */}
      <div className="flex space-x-4 mt-4">
        <button
          className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handlePurchase}
          disabled={rowSelectionModel.length === 0 || !providerName}
        >
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          Procesar Compra
        </button>
      </div>
    </div>
  );
};

export default Buy;
