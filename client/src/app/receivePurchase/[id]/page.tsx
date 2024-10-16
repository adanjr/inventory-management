"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Hook para redirigir
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import { useEffect } from "react";

// Simulated data for purchase and vehicles
const purchaseOrder = {
  purchaseId: 1,
  purchaseDate: "2024-10-01",
  supplierName: "Proveedor A",
  totalPurchase: 15000.0,
  vehicles: [
    {
      vehicleId: 1,
      vin: "VIN1234567890",
      model: "Modelo A",
      status: "Pendiente",
      condition: "N/A", // Nueva columna para estado de recepción
    },
    {
      vehicleId: 2,
      vin: "VIN0987654321",
      model: "Modelo B",
      status: "Pendiente",
      condition: "N/A",
    },
  ],
};

// Format currency for display
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);

const ReceivePurchaseOrderPage = () => {
  const [vehicles, setVehicles] = useState(purchaseOrder.vehicles);
  const [overallStatus, setOverallStatus] = useState("Pendiente");
  const [observations, setObservations] = useState("");
  const router = useRouter();

  // Handle vehicle status change
  const handleVehicleStatusChange = (id: number, newStatus: string, condition: string) => {
    const updatedVehicles = vehicles.map((vehicle) =>
      vehicle.vehicleId === id
        ? { ...vehicle, status: newStatus, condition: condition }
        : vehicle
    );
    setVehicles(updatedVehicles);
  };

  const columns: GridColDef[] = [
    { field: "vehicleId", headerName: "ID", width: 50 },
    { field: "vin", headerName: "VIN", width: 200 },
    { field: "model", headerName: "Modelo", width: 150 },
    {
      field: "status",
      headerName: "Estado de Recepción",
      width: 200,
      renderCell: (params) => (
        <select
          value={params.row.status}
          onChange={(e) =>
            handleVehicleStatusChange(
              params.row.vehicleId,
              e.target.value,
              params.row.condition
            )
          }
          className="border p-1 rounded"
        >
          <option value="Pendiente">Pendiente</option>
          <option value="Recibido">Recibido</option>
          <option value="Faltante">Faltante</option>
          <option value="Dañado">Dañado</option>
        </select>
      ),
    },
    {
      field: "condition",
      headerName: "Condición",
      width: 200,
      renderCell: (params) => (
        <input
          type="text"
          value={params.row.condition}
          onChange={(e) =>
            handleVehicleStatusChange(
              params.row.vehicleId,
              params.row.status,
              e.target.value
            )
          }
          className="border p-1 rounded w-full"
        />
      ),
    },
  ];

  const handleReceiveOrder = () => {
    // Validar que todos los vehículos han sido revisados
    const allVehiclesChecked = vehicles.every(
      (vehicle) => vehicle.status !== "Pendiente"
    );
    if (!allVehiclesChecked) {
      alert("Todos los vehículos deben ser revisados antes de confirmar.");
      return;
    }

    // Aquí puedes realizar la lógica para guardar la recepción en tu backend.
    // Simulación de redirección
    router.push("/success");
  };

  return (
    <div className="mx-auto py-5 w-full">
      {/* Header */}
      <Header name="Recepción de Orden de Compra" />

      {/* Información general de la orden */}
      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        <h2 className="text-lg font-bold">Orden de Compra #{purchaseOrder.purchaseId}</h2>
        <p>Proveedor: {purchaseOrder.supplierName}</p>
        <p>Fecha: {purchaseOrder.purchaseDate}</p>
        <p>Costo Total: {formatCurrency(purchaseOrder.totalPurchase)}</p>
      </div>

      {/* DataGrid de vehículos */}
      <div className="bg-white p-4 shadow-md rounded-lg">
        <h3 className="text-lg font-bold mb-4">Vehículos en la Orden</h3>
        <DataGrid
          rows={vehicles}
          columns={columns}
          getRowId={(row) => row.vehicleId} // Unique ID for each row         
          className="bg-white shadow rounded-lg border border-gray-200 !text-gray-700"
        />
      </div>

      {/* Observaciones generales */}
      <div className="mt-6 bg-white p-4 shadow-md rounded-lg">
        <label className="block font-bold mb-2">Observaciones Generales</label>
        <textarea
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          rows={4}
          className="border p-2 rounded w-full"
          placeholder="Añadir observaciones si es necesario..."
        />
      </div>

      {/* Botones de acción */}
      <div className="mt-6 flex justify-end space-x-4">
        <button
          className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
          onClick={() => router.push("/purchasesOrders")} // Redirigir a otra página en caso de cancelación
        >
          Cancelar
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          onClick={handleReceiveOrder}
        >
          Guardar
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          onClick={handleReceiveOrder}
        >
          Confirmar Recepción
        </button>
      </div>
    </div>
  );
};

export default ReceivePurchaseOrderPage;
