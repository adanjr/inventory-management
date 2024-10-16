"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Hook para redirigir
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import { useGetPurchasesQuery, useGetSuppliersQuery } from "@/state/api"; // Import the API hooks

// Format currency for display
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);

// DataGrid columns configuration
const columns: GridColDef[] = [
  { field: "purchaseId", headerName: "ID", width: 50 },
  { field: "supplierName", headerName: "Proveedor", width: 100 },
  { field: "purchaseOrder", headerName: "Orden de Compra", width: 100 },
  { field: "purchaseDate", headerName: "Fecha de Compra", width: 100 },
  { field: "deliveryEstimate", headerName: "Estimacion de Entrega", width: 100 },
  { field: "purchaseStatus", headerName: "Estatus", width: 100 },
  {
    field: "totalCost",
    headerName: "Costo Total",
    width: 150,
    type: "number",
    valueFormatter: (params) => formatCurrency(params),
  },
];

const PurchasesOrderPage = () => {
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");

  const router = useRouter(); // Hook para redirigir

  // Fetch purchases and suppliers using RTK Query
  const { data: purchases = [], isLoading: purchasesLoading } = useGetPurchasesQuery();
  const { data: suppliers = [], isLoading: suppliersLoading } = useGetSuppliersQuery();

  // Filter the purchases based on date range and supplier
  const filteredPurchases = purchases.filter((purchase: any) => {
    const purchaseDate = new Date(purchase.timestamp);
    const isWithinDateRange =
      (!startDate || new Date(startDate) <= purchaseDate) &&
      (!endDate || new Date(endDate) >= purchaseDate);
    const matchesSupplier =
      !selectedSupplier || purchase.supplierName === selectedSupplier;
    return isWithinDateRange && matchesSupplier;
  });

  // Función para manejar el clic en "Agregar Orden de Compra"
  const handleAddPurchaseOrder = () => {
    router.push("/buy"); // Redirigir a la página 'buy'
  };

  // Función para manejar el clic en "Recibir Orden de Compra"
  const handleReceiveOrder = () => {
    if (rowSelectionModel.length > 0) {
      const selectedOrderId = rowSelectionModel[0];
      router.push(`/receivePurchase/${selectedOrderId}`); // Redirigir a la página de recibir la orden de compra
    }
  };

  return (
    <div className="mx-auto py-5 w-full">
      {/* Header */}
      <Header name="Lista de Ordenes de Compras" />

      {/* Botón para agregar una nueva orden de compra */}
      <div className="flex justify-end mt-3">
        <button
          onClick={handleAddPurchaseOrder}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Agregar Orden de Compra
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 items-end mt-5">
        {/* Date range filters */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Desde</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded p-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Hasta</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded p-2"
          />
        </div>

        {/* Supplier filter */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Proveedor</label>
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="border border-gray-300 rounded p-2"
          >
            <option value="">Todos</option>
            {suppliers.map((supplier: any) => (
              <option key={supplier.supplierId} value={supplier.name}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Purchases DataGrid */}
      <div className="w-full mt-5">
        {purchasesLoading || suppliersLoading ? (
          <p>Cargando datos...</p>
        ) : (
          <DataGrid
            rows={filteredPurchases}
            columns={columns}
            getRowId={(row) => row.purchaseId} // Unique ID for each row
            checkboxSelection
            disableMultipleRowSelection
            className="bg-white shadow rounded-lg border border-gray-200 !text-gray-700"
            onRowSelectionModelChange={(newRowSelectionModel) =>
              setRowSelectionModel(newRowSelectionModel)
            }
            rowSelectionModel={rowSelectionModel}
          />
        )}
      </div>

      {/* Selected row details or actions */}
      {rowSelectionModel.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Compra seleccionada:</h2>
          <p>ID de compra: {rowSelectionModel[0]}</p>
          {/* Botón para recibir la orden de compra seleccionada */}
          <button
            onClick={handleReceiveOrder}
            className="mt-3 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Recibir Orden de Compra
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchasesOrderPage;
