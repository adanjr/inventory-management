// src/app/(components)/ProductsGrid.tsx
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { PlusCircleIcon, EditIcon, DeleteIcon, UploadIcon, DownloadIcon, Eye } from "lucide-react";
 import * as XLSX from 'xlsx';
import { PermissionPage, 
         useDeleteProductMutation,
         Product } from "@/state/api";

// Formato de moneda para México
const formatCurrency = (value: number | null | undefined) => {
  if (value == null || isNaN(value)) {
    return "$0.00";
  }
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
};

const columns: GridColDef[] = [
  { field: "productId", headerName: "ID", width: 30 },
  { field: "productCode", headerName: "Codigo", width: 150 },
  { field: "name", headerName: "Nombre", width: 150 },
  { field: "stockQuantity", headerName: "Cantidad en Stock", width: 150 },
  {
    field: "price",
    headerName: "Precio",
    width: 100,
    type: "number",
    valueFormatter: (params) => formatCurrency(params),
  },
  { field: "reorderQuantity", headerName: "Cantidad de Reorden", width: 150 },
];

interface ProductsGridProps {
  products: Product[];
  role: string;
  permissions: string[]; 
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ products, role, permissions }) => {
  const router = useRouter();
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<number | string>("");

  const transformPermissions = (permissionsArray: string[]): PermissionPage => {
    return {
      canAccess: permissionsArray.includes("ACCESS"),
      canAdd: permissionsArray.includes("ADD"),
      canEdit: permissionsArray.includes("EDIT"),
      canDelete: permissionsArray.includes("DELETE"),
      canImport: permissionsArray.includes("IMPORT"),
      canExport: permissionsArray.includes("EXPORT"),
      canViewDetail: permissionsArray.includes("VIEW_DETAIL"),
    };
  };

  const [deleteProduct] = useDeleteProductMutation();

  // Transformar los permisos a booleanos
  const userPermissions = transformPermissions(permissions);

  const handleDelete = async () => {
    const selectedProductId = rowSelectionModel[0];
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProduct(String(selectedProductId));
        alert("Producto eliminado con éxito.");
      } catch (error) {
        console.error("Error eliminando el producto:", error);         
      }
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
    XLSX.writeFile(workbook, "productos.xlsx");
  };

  return (
    <div>
      <div className="flex space-x-4 mt-4">
        {userPermissions.canAdd && (
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push("/products/create")}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Agregar Producto
          </button>
        )}
        {userPermissions.canViewDetail && (
          <button
            className="flex items-center bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push(`/products/detail/${rowSelectionModel[0]}`)}
            disabled={rowSelectionModel.length === 0}
          >
            <Eye className="w-5 h-5 mr-2" />
            Ver Detalle
          </button>
        )}
        {userPermissions.canEdit && (
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push(`/products/edit/${rowSelectionModel[0]}`)}
            disabled={rowSelectionModel.length === 0}
          >
            <EditIcon className="w-5 h-5 mr-2" />
            Editar Producto
          </button>
        )}
        {userPermissions.canDelete && (
          <button
            className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleDelete}
            disabled={rowSelectionModel.length === 0}
          >
            <DeleteIcon className="w-5 h-5 mr-2" />
            Eliminar Producto
          </button>
        )}
        {userPermissions.canAdd && (
          <button
            className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            <UploadIcon className="w-5 h-5 mr-2" />
            Importar
          </button>
        )}
        {userPermissions.canExport && (
          <button
            className="flex items-center bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            onClick={exportToExcel}
          >
            <DownloadIcon className="w-5 h-5 mr-2" />
            Exportar a Excel
          </button>
        )}
      </div>

      {/* Espacio entre botones y el grid */}
      <div className="mt-6">
        <DataGrid
          rows={products}
          columns={columns}
          getRowId={(row) => row.productId}          
          checkboxSelection
          disableMultipleRowSelection 
          onRowSelectionModelChange={(newSelection) => setRowSelectionModel(newSelection)}
          rowSelectionModel={rowSelectionModel}
        />
      </div>

    
    </div>
  );
};

export default ProductsGrid;
