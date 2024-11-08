"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams  } from "next/navigation";
import { useGetAuthUserQuery, 
         useGetRolePermissionsByModuleQuery,
         useGenerateSendPdfMutation, 
         useGetSaleByIdQuery, 
         useGenerateDownloadPdfQuery,
         PermissionPage } from "@/state/api";  
import { Sale } from "@/state/api";  
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const SaleDetailPage = () => {
  const { data: currentUser } = useGetAuthUserQuery({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('Id')
  const { data: sale, isLoading, isError } = useGetSaleByIdQuery(id ?? ''); // Hook para obtener la venta por ID
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

  const { data: pdfData, error: pdfError, isLoading: isLoadingPdf } = useGenerateDownloadPdfQuery(id ?? '', {
    skip: !id,
  });

  const userPermissions = permissionsData?.permissions || [];

  const [generateSendPdf, { data: sendPdfResponse, error: sendPdfError }] = useGenerateSendPdfMutation(); 

  const handleDownload = async () => {
    try {
      if (pdfData) {
        const url = window.URL.createObjectURL(new Blob([pdfData], { type: 'application/pdf' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = `nota_venta_${id}.pdf`; // Nombre del archivo a descargar
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url); // Limpia el objeto URL después de la descarga
        alert('Exito descargando el correo');
      }
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
      alert('Error descargando el PDF');
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      alert('No hay ID disponible para enviar el correo.');
      return;
    }
    
    try {     
      await generateSendPdf(id); // Asegúrate de que esta línea sea la correcta para tu caso
      alert('Correo enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar correo:', error);
      alert('Error enviando el correo');
    }
  };

  if (isLoading) return <div>Cargando...</div>;
  if (isError) return <div>Error al cargar los detalles de la venta</div>;

  
  if (pdfError) {
    console.log('PDF Error:', pdfError);
  }

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



  if (pdfError) return <div>Error al descargar los detalles de la venta</div>;

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
          onClick={() => router.push("/salesOrders")}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Regresar a Ventas
        </button>
        {permissions.canExport && ( 
        <button
          onClick={handleSendEmail}  
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
        >
           Enviar a Cliente
        </button> )}
        {permissions.canExport && ( 
        <button
          onClick={handleDownload}
          disabled={!pdfData || isLoadingPdf}
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
        >
          {isLoadingPdf ? 'Descargando...' : 'Descargar Nota de Venta'}
        </button> )}
      </div>
    </div>
  );
};

export default SaleDetailPage;
