"use client";

import { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import {  useGetAuthUserQuery, 
          useGetRolePermissionsByModuleQuery,
          useGetSalesQuery,
          PermissionPage } from "@/state/api";  
import { Sale } from "@/state/api";  
import { useRouter } from "next/navigation";

const SalesOrdersPage = () => {
  const { data: currentUser } = useGetAuthUserQuery({});
  const router = useRouter();  
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<number | undefined>(undefined);
  const [roleId, setRoleId] = useState<string | undefined>(undefined);
  const [moduleName, setModuleName] = useState("Sales");
  const [subModuleName, setSubModuleName] = useState("Ordenes");

  useEffect(() => {
    if (currentUser?.userDetails?.roleId) {
      setRoleId(currentUser.userDetails.roleId.toString());
    }
  }, [currentUser]);

  const { data: permissionsData, isLoading: permissionsLoading } = useGetRolePermissionsByModuleQuery(
    {
      roleId: roleId || "",  // Si roleId no está disponible, pasamos una cadena vacía o un valor adecuado
      moduleName,
      subModuleName,
    },
    { skip: !roleId }  // Esto evita la consulta cuando no tenemos roleId
  );

   const { data: sales = [], isLoading, isError } = useGetSalesQuery();

   const userPermissions = permissionsData?.permissions || [];

   if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar las ventas</div>;

   const filteredSales = sales.filter((sale: Sale) => {
    const saleDate = new Date(sale.timestamp);
    const isWithinDateRange =
      (!startDate || new Date(startDate) <= saleDate) &&
      (!endDate || new Date(endDate) >= saleDate);
    const matchesCustomer =
      selectedCustomer === undefined || (sale.customer && sale.customer.customerId === selectedCustomer);
    return isWithinDateRange && matchesCustomer;
  });

  // Configuración de columnas para DataGrid
  const columns: GridColDef[] = [
    { field: "saleId", headerName: "ID", width: 50 },
    { field: "locationName", headerName: "Ubicación", width: 200 },
    {
      field: "timestamp",
      headerName: "Fecha",
      width: 150,
      valueGetter: (params) => {
        const date = new Date(params);
        return date.toLocaleDateString();
      },
    },
    { field: "customerName", headerName: "Cliente", width: 200 },    
    { field: "totalAmount", headerName: "Monto Total", width: 150, type: "number", valueFormatter: (params) => formatCurrency(params) },
  ];

  // Formatear moneda para mostrar
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);

  const handleViewDetails = () => {
    if (rowSelectionModel.length > 0) {
      router.push(`/salesOrders/details?Id=${rowSelectionModel[0]}`); // Redirige a la página de detalles de la venta
    }
  };

  const transformPermissions = (userPermissions: string[]): PermissionPage => {
    return {      
      canAccess: userPermissions.includes("ACCESS"),    
      canAdd: userPermissions.includes("ADD"),    
      canEdit: userPermissions.includes("EDIT"),    
      canDelete: userPermissions.includes("DELETE"),    
      canImport: userPermissions.includes("IMPORT"),    
      canExport: userPermissions.includes("EXPORT"),    
      canViewDetail: userPermissions.includes("VIEW_DETAIL"),    
    };
  };

  const permissions = transformPermissions(userPermissions);

  return (
    <div className="mx-auto py-5 w-full">
      {/* Header */}
      <Header name="Lista de Ventas" />

      {/* Filters */}
      <div className="flex items-end mt-5">
      {/* Date range filters */}
        <div className="flex space-x-4">
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
              onChange={(e) => setSelectedCustomer(e.target.value ? Number(e.target.value) : undefined)}
              className="border border-gray-300 rounded p-2"
            >
              <option value="">Todos</option>
              {/* Aquí puedes generar dinámicamente la lista de clientes según tus datos */}
              {Array.from(new Set(sales.map(sale => sale.customer?.customerId))).map((customerId) => {
                const customer = sales.find(sale => sale.customer?.customerId === customerId)?.customer;
                return customer ? (
                  <option key={customer.customerId} value={customer.customerId}>
                    {customer.name}
                  </option>
                ) : null;
              })}
            </select>
          </div>
      </div>

      <div className="flex space-x-4 ml-auto">
      {permissions.canDelete && ( 
        <button
          disabled={rowSelectionModel.length === 0}
          className={`px-4 py-2 bg-yellow-500 text-white rounded ${
            rowSelectionModel.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600'
          }`}
        >
          Devolución de Venta
        </button> )}
        {permissions.canViewDetail && ( 
        <button
          onClick={handleViewDetails}
          disabled={rowSelectionModel.length === 0}
          className={`px-4 py-2 bg-blue-500 text-white rounded ${
            rowSelectionModel.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          Ver Detalles
        </button> )}
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
          onRowSelectionModelChange={(newRowSelectionModel) => setRowSelectionModel(newRowSelectionModel)}
          rowSelectionModel={rowSelectionModel}
        />
      </div>

      {/* Selected row details or actions */}
      {rowSelectionModel.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Venta seleccionada:</h2>
          <p>ID de venta: {rowSelectionModel[0]}</p>
        </div>
      )}
    </div>
  );
};

export default SalesOrdersPage;
