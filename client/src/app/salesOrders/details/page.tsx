"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams  } from "next/navigation";
import { useGeneratePdfQuery, useGetSaleByIdQuery } from "@/state/api"; // Asegúrate de tener un hook para obtener la venta por ID
import { Sale } from "@/state/api"; // Importa tus interfaces
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const SaleDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('Id')
  const { data: sale, isLoading, isError } = useGetSaleByIdQuery(id ?? ''); // Hook para obtener la venta por ID

  const { data: pdfData, error: pdfError, isLoading: isLoadingPdf } = useGeneratePdfQuery(id ?? '', {
    skip: !id,
  });

  const handleDownload = async () => {
    if (pdfData) {
      const url = window.URL.createObjectURL(pdfData);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nota_venta_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Limpia el objeto URL
    }
  };

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar los detalles de la venta</div>;

  if (!sale) {
    return <div>No se encontraron detalles para esta venta.</div>;
  }

  // Configuración de columnas para DataGrid
  const columns: GridColDef[] = [
    { field: "internalSerial", headerName: "Número de Serial", width: 200 },
    { field: "engineNumber", headerName: "Número de Motor", width: 200 },
    { field: "model", headerName: "Modelo", width: 100 },
    { field: "year", headerName: "Año", width: 70 },
    { field: "color", headerName: "Color", width: 80 },
    { field: "quantity", headerName: "Cantidad", width: 80 },
    { field: "price", headerName: "Precio", width: 150, valueFormatter: (params) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(params) },
    { field: "subtotal", headerName: "Subtotal", width: 80, valueFormatter: (params) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(params)  },
  ];

  // Mapea los detalles de la venta para el DataGrid
  const rows = sale.saleDetails.map(detail => ({
    id: detail.saleDetailId, // Identificador único para DataGrid
    vehicleId: detail.vehicle?.vehicleId || "N/A",
    engineNumber: detail.vehicle?.engineNumber || "N/A",
    internalSerial: detail.vehicle?.internal_serial || "N/A",
    year: detail.vehicle?.year || "N/A",
    model: detail.vehicle?.model.name || "N/A",
    color: detail.vehicle?.color.name || "N/A", // Aquí deberías mapear el color si tienes un objeto color
    price: detail.unitPrice,
    quantity: detail.quantity,
    subtotal: detail.subtotal,
    description: detail.vehicle?.description || "No especificado",
  }));

  return (
    <div className="mx-auto py-5 w-full">
      <h1 className="text-2xl font-bold">Detalles de la Venta #{sale.saleId}</h1>
      
      {/* Información general de la venta */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="border p-4 rounded shadow">
          <label className="block text-sm font-medium">Fecha:</label>
          <input type="text" value={new Date(sale.timestamp).toLocaleDateString()} readOnly className="border rounded w-full p-2" />
        </div>
        <div className="border p-4 rounded shadow">
          <label className="block text-sm font-medium">Monto Total:</label>
          <input type="text" value={new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(sale.totalAmount)} readOnly className="border rounded w-full p-2" />
        </div>
        <div className="border p-4 rounded shadow">
          <label className="block text-sm font-medium">Método de Pago:</label>
          <input type="text" value={sale.paymentMethod || "No especificado"} readOnly className="border rounded w-full p-2" />
        </div>
        <div className="border p-4 rounded shadow">
          <label className="block text-sm font-medium">Cliente:</label>
          <input type="text" value={`${sale.customer?.name || "No especificado"} ${sale.customer?.lastname || ""}`} readOnly className="border rounded w-full p-2" />
        </div>
        <div className="border p-4 rounded shadow">
          <label className="block text-sm font-medium">Ubicación:</label>
          <input type="text" value={sale.location?.name || "No especificado"} readOnly className="border rounded w-full p-2" />
        </div>
        <div className="border p-4 rounded shadow">
          <label className="block text-sm font-medium">Dirección:</label>
          <input type="text" value={`${sale.customer?.address || ""}, ${sale.customer?.postalCode || ""} ${sale.customer?.city || ""} ${sale.customer?.state || ""}`.trim() || "No especificado"} 
          readOnly className="border rounded w-full p-2" />
        </div>
      </div>

      {/* Detalles de los Productos */}
      <h2 className="mt-5 text-lg font-semibold">Listas de Vehículos:</h2>
      <div className="w-full mt-4">
        <DataGrid
          rows={rows}
          columns={columns}                  
          autoHeight
          className="bg-white shadow rounded-lg border border-gray-200 !text-gray-700"
        />
      </div>

      {/* Botones de acción */}
      <div className="flex space-x-4 mt-5">
        <button
          onClick={() => router.push("/salesOrders/page")}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Regresar a Ventas
        </button>
        <button
          onClick={handleDownload}  
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
        >
           Descargar Nota de Venta
        </button>
      </div>
    </div>
  );
};

export default SaleDetailPage;
