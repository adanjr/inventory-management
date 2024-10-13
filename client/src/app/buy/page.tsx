"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useGetVehiclesQuery } from "@/state/api";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import { CheckCircleIcon, UploadIcon } from "lucide-react";
import ImportVehiclesModal from "./ImportVehiclesModal";

// Formato de moneda para México
const formatCurrency = (value: number | null | undefined) => {
  return value == null || isNaN(value) ? "$0.00" : new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
};

const locations = [
  { id: 1, name: "Almacén Central" },
  { id: 2, name: "Sucursal Norte" },
];

const transportMethods = [
  { id: 'truck', name: "Camión" },
  { id: 'ship', name: "Barco" },
  { id: 'container', name: "Contenedor" },
];

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
  { field: "price", headerName: "Precio", width: 100, type: "number", valueFormatter: (params) => formatCurrency(params) },
  { field: "location", headerName: "Ubicación", width: 150, editable: true, type: 'singleSelect', valueOptions: locations.map(l => l.name) },
];

const Buy = () => {
  const router = useRouter();
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [providerName, setProviderName] = useState("");
  const [totalPurchase, setTotalPurchase] = useState(0);
  const [vehiclesToLoad, setVehiclesToLoad] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalLocationId, setGlobalLocationId] = useState("");
  const [transportMethod, setTransportMethod] = useState("");
  const [notes, setNotes] = useState("");

  const handlePurchase = async () => {
    if (rowSelectionModel.length === 0 || !providerName || !transportMethod) {
      alert("Por favor selecciona al menos un vehículo, proporciona el nombre del proveedor y el método de transporte.");
      return;
    }
    const selectedVehicleIds = rowSelectionModel;
    alert(`Compra procesada para los vehículos ID: ${selectedVehicleIds.join(", ")}. Proveedor: ${providerName}, Método de transporte: ${transportMethod}`);
  };

  
  return (
    <div className="mx-auto pb-5 w-full">
      <div className="mb-6 flex flex-col">
        <Header name="Compras" />
        <div className="flex mb-4">
          <input
            className="w-3/4 py-2 px-4 border-2 border-gray-200 rounded"
            placeholder="Nombre del Proveedor"
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
          />
          <button
            className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            <UploadIcon className="w-5 h-5" />
            Cargar Lote
          </button>
        </div>

        {/* Selección de ubicación global */}
        <div className="mb-4">
          <label className="block mb-2">Ubicación Global para todos los vehículos:</label>
          <select
            value={globalLocationId}         
            className="border p-2 rounded w-full"
          >
            <option value="" disabled>Selecciona una ubicación</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>

        {/* Selección de método de transporte */}
        <div className="mb-4">
          <label className="block mb-2">Método de Transporte:</label>
          <select
            value={transportMethod}
            onChange={(e) => setTransportMethod(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="" disabled>Selecciona el método de transporte</option>
            {transportMethods.map(method => (
              <option key={method.id} value={method.id}>{method.name}</option>
            ))}
          </select>
        </div>

        {/* Campo de notas adicionales */}
        <div className="mb-4">
          <label className="block mb-2">Notas adicionales:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Detalles adicionales sobre la compra..."
          />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-2">Vehículos a Comprar</h2>
      <DataGrid
        rows={vehiclesToLoad}
        columns={columns}
        getRowId={(row) => row.vehicleId}
        checkboxSelection
        disableMultipleRowSelection
        className="bg-white shadow rounded-lg border border-gray-200 mb-4"
        onRowSelectionModelChange={(newRowSelectionModel) => setRowSelectionModel(newRowSelectionModel)}
        rowSelectionModel={rowSelectionModel}
      />

      <div className="flex justify-end">
        <div className="bg-gray-200 p-4 rounded-lg shadow-lg text-lg">
          <strong>Total Compra: </strong>{formatCurrency(totalPurchase)}
        </div>
      </div>

      <div className="flex space-x-4 mt-4">
        <button
          className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handlePurchase}
          disabled={rowSelectionModel.length === 0 || !providerName || !transportMethod}
        >
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          Procesar Compra
        </button>
      </div>

      <ImportVehiclesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={(vehicles) => setVehiclesToLoad([])}
      />
    </div>
  );
};

export default Buy;
