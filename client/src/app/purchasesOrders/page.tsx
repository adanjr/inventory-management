"use client";

import { useState } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";

// Simulated data for purchases
const purchases = [
  {
    purchaseId: 1,
    timestamp: "2024-10-01",
    totalCost: 15000.0,
    supplierName: "Proveedor A",
  },
  {
    purchaseId: 2,
    timestamp: "2024-09-25",
    totalCost: 12000.5,
    supplierName: "Proveedor B",
  },
  {
    purchaseId: 3,
    timestamp: "2024-09-20",
    totalCost: 18000.75,
    supplierName: "Proveedor C",
  },
];

// Format currency for display
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);

// DataGrid columns configuration
const columns: GridColDef[] = [
  { field: "purchaseId", headerName: "ID", width: 50 },
  { field: "timestamp", headerName: "Fecha", width: 150 },
  { field: "supplierName", headerName: "Proveedor", width: 200 },
  {
    field: "totalCost",
    headerName: "Costo Total",
    width: 150,
    type: "number",
    valueFormatter: (params) => formatCurrency(params),
  },
];

const suppliers = ["Proveedor A", "Proveedor B", "Proveedor C"];

const PurchasesOrderPage = () => {
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");

  // Filter the purchases based on date range and supplier
  const filteredPurchases = purchases.filter((purchase) => {
    const purchaseDate = new Date(purchase.timestamp);
    const isWithinDateRange =
      (!startDate || new Date(startDate) <= purchaseDate) &&
      (!endDate || new Date(endDate) >= purchaseDate);
    const matchesSupplier =
      !selectedSupplier || purchase.supplierName === selectedSupplier;
    return isWithinDateRange && matchesSupplier;
  });

  return (
    <div className="mx-auto py-5 w-full">
      {/* Header */}
      <Header name="Lista de Compras" />

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
            {suppliers.map((supplier) => (
              <option key={supplier} value={supplier}>
                {supplier}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Purchases DataGrid */}
      <div className="w-full mt-5">
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
      </div>

      {/* Selected row details or actions */}
      {rowSelectionModel.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Compra seleccionada:</h2>
          <p>ID de compra: {rowSelectionModel[0]}</p>
          {/* Additional details or actions for the selected purchase */}
        </div>
      )}
    </div>
  );
};

export default PurchasesOrderPage;
