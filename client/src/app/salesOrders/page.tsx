"use client";

import { useState } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";

// Simulated data for sales
const sales = [
  {
    saleId: 1,
    timestamp: "2024-10-01",
    quantity: 2,   
    totalAmount: 30000.0,
    customerName: "Cliente A",
  },
  {
    saleId: 2,
    timestamp: "2024-09-25",
    quantity: 1,  
    totalAmount: 12000.5,
    customerName: "Cliente B",
  },
  {
    saleId: 3,
    timestamp: "2024-09-20",
    quantity: 3,    
    totalAmount: 54002.25,
    customerName: "Cliente C",
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
  { field: "saleId", headerName: "ID", width: 50 },
  { field: "timestamp", headerName: "Fecha", width: 150 },
  { field: "customerName", headerName: "Cliente", width: 200 },
  { field: "quantity", headerName: "Cantidad", width: 100 },   
  {
    field: "totalAmount",
    headerName: "Monto Total",
    width: 150,
    type: "number",
    valueFormatter: (params) => formatCurrency(params),
  },
];

const customers = ["Cliente A", "Cliente B", "Cliente C"];

const SalesOrdersPage = () => {
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

  // Filter the sales based on date range and customer
  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.timestamp);
    const isWithinDateRange =
      (!startDate || new Date(startDate) <= saleDate) &&
      (!endDate || new Date(endDate) >= saleDate);
    const matchesCustomer =
      !selectedCustomer || sale.customerName === selectedCustomer;
    return isWithinDateRange && matchesCustomer;
  });

  return (
    <div className="mx-auto py-5 w-full">
      {/* Header */}
      <Header name="Lista de Ventas" />

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

        {/* Customer filter */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Cliente</label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="border border-gray-300 rounded p-2"
          >
            <option value="">Todos</option>
            {customers.map((customer) => (
              <option key={customer} value={customer}>
                {customer}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sales DataGrid */}
      <div className="w-full mt-5">
        <DataGrid
          rows={filteredSales}
          columns={columns}
          getRowId={(row) => row.saleId} // Unique ID for each row
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
          <h2 className="text-lg font-semibold">Venta seleccionada:</h2>
          <p>ID de venta: {rowSelectionModel[0]}</p>
          {/* Additional details or actions for the selected sale */}
        </div>
      )}
    </div>
  );
};

export default SalesOrdersPage;
