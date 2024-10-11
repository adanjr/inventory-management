"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useGetVehiclesQuery } from "@/state/api";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import { ShoppingCartIcon, CheckCircleIcon, SearchIcon } from "lucide-react"; 

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

const Sales = () => {
  const router = useRouter();
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [customerName, setCustomerName] = useState("");
  const [saleConfirmation, setSaleConfirmation] = useState(false);
  const [totalSale, setTotalSale] = useState(0);
  const [vehicleCode, setVehicleCode] = useState("");

  // Se eliminaron las consultas para obtener vehículos inicialmente
  const { data: vehicles = [], isError, isLoading } = useGetVehiclesQuery("%", { skip: true });

  const handleSale = async () => {
    if (rowSelectionModel.length === 0 || !customerName) {
      alert("Por favor selecciona un vehículo y proporciona el nombre del cliente.");
      return;
    }

    const selectedVehicleId = rowSelectionModel[0];
    // Lógica para procesar la venta del vehículo...
    setSaleConfirmation(true);
    alert(`Venta procesada con éxito para el vehículo ID: ${selectedVehicleId}, Cliente: ${customerName}`);
    // Aquí podrías hacer una llamada a una API para guardar la venta, etc.
  };

  const handleScan = () => {
    const vehicle = vehicles.find(v => v.vin === vehicleCode); // Busca el vehículo por el VIN escaneado
    if (vehicle) {
      setRowSelectionModel([vehicle.vehicleId]); // Selecciona el vehículo encontrado
      setTotalSale(prevTotal => prevTotal + vehicle.price); // Actualiza el total de la venta
      setVehicleCode(""); // Limpiar el campo de escaneo
    } else {
      alert("Vehículo no encontrado.");
    }
  };

  const handleSearchVehicle = () => {
    router.push("/vehicles"); // Redirigir a la página de búsqueda de vehículos
  };

  return (
    <div className="mx-auto pb-5 w-full">
      {/* Header y barra de búsqueda */}
      <div className="mb-6 flex flex-col">
        <div className="flex justify-between items-center">
          <Header name="Punto de Venta" />
        </div>
        <div className="flex mb-4">
          <input
            className="w-3/4 py-2 px-4 border-2 border-gray-200 rounded"
            placeholder="Nombre del Cliente"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <button className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <SearchIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex mb-4">
          <input
            className="w-3/4 py-2 px-4 border-2 border-gray-200 rounded"
            placeholder="Escanear Código del Vehículo (VIN)"
            value={vehicleCode}
            onChange={(e) => setVehicleCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScan()} // Escanear al presionar Enter
          />
          <button
            className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleScan}
          >
            Agregar
          </button>
          <button
            className="ml-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSearchVehicle}
          >
            Buscar Vehículo
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

      {/* Total de venta en la esquina inferior derecha */}
      <div className="flex justify-end">
        <div className="bg-gray-200 p-4 rounded-lg shadow-lg text-lg">
          <strong>Total Venta: </strong>{formatCurrency(totalSale)}
        </div>
      </div>

      {/* Botones de venta */}
      <div className="flex space-x-4 mt-4">
        <button
          className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSale}
          disabled={rowSelectionModel.length === 0 || !customerName}
        >
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          Procesar Venta
        </button>
        {saleConfirmation && (
          <div className="text-green-600 mt-2">
            Venta confirmada.
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
