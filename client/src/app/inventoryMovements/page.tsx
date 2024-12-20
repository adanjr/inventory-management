"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { 
         useGetAuthUserQuery, 
         useGetRolePermissionsByModuleQuery,
         useGetMovementsQuery, 
         useDeleteMovementMutation, 
         Movement,
         PermissionPage } from "@/state/api"; // Ajusta la importación según tu configuración
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import { PlusCircleIcon, EditIcon, DeleteIcon, MoveHorizontal, ListTodo, ConciergeBell } from "lucide-react";

const columns: GridColDef[] = [
  { field: "movementId", headerName: "ID", width: 50 },
  { field: "orderReference", headerName: "Orden", width: 100 },
  { field: "fromLocationName", headerName: "Origen", width: 150 },
  { field: "toLocationName", headerName: "Destino", width: 150 },
  { field: "quantity", headerName: "Cantidad", width: 80 },
  { field: "movementType", headerName: "Tipo de Movimiento", width: 150 },
  {
    field: "movementDate",
    headerName: "Fecha del Movimiento",
    width: 150,
    valueFormatter: (params) => new Date(params).toLocaleDateString(),
  },
  { field: "status", headerName: "Estado", width: 100 },
  { field: "notes", headerName: "Notas", width: 200 },
];

const InventoryMovements = () => {
  const { data: currentUser } = useGetAuthUserQuery({});
  const router = useRouter();
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [roleId, setRoleId] = useState<string | undefined>(undefined);
  const [moduleName, setModuleName] = useState("Inventory");
  const [subModuleName, setSubModuleName] = useState("Movimientos");

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

  const { data: movements, isError, isLoading } = useGetMovementsQuery();

  const [deleteMovement] = useDeleteMovementMutation();

  const userPermissions = permissionsData?.permissions || [];

  if (isLoading) return <div>Cargando...</div>;
  if (isError || !movements) return <div>Fallo al cargar movimientos de inventario</div>;

  const isSelectionEmpty = rowSelectionModel.length === 0;

  const handleDelete = async () => {
    const selectedMovementId = rowSelectionModel[0];

    if (window.confirm("¿Estás seguro de que deseas eliminar este movimiento?")) {
      try {
        await deleteMovement(String(selectedMovementId)).unwrap();
        alert("Movimiento eliminado con éxito.");
      } catch (error) {
        console.error("Error eliminando el movimiento:", error);
      }
    }
  };

  const isButtonDisabled = () => {
    if (rowSelectionModel.length === 0) return true; // Si no hay selección, deshabilitar
    const selectedRow = movements.find(row => row.movementId === rowSelectionModel[0]);
    return !(selectedRow?.movementType === "TRANSFERENCIA" && selectedRow?.status === "EN TRANSITO");
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
    <div className="mx-auto pb-5 w-full">
      {/* Header y botones */}
      <div className="mb-6 flex flex-col">
        <div className="flex justify-between items-center">
          <Header name="Movimientos de Inventario" />
        </div>
        <div className="flex space-x-4 mt-4">
        {permissions.canAdd && ( 
        <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push('/movements')}
          >
            <MoveHorizontal className="w-5 h-5 mr-2" />  
            Agregar Movimiento
          </button>  
        )}
          {permissions.canAdd && ( 
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push(`/movements/reception?id=${rowSelectionModel[0]}`)}
            disabled={isButtonDisabled()}
          >
            <ConciergeBell className="w-5 h-5 mr-2" />  
            Recibir Transferencia
          </button>
          )}
           {permissions.canViewDetail && ( 
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              if (!isSelectionEmpty) {
                router.push(`/movements/details?id=${rowSelectionModel[0]}`);
              }
            }}
            disabled={isSelectionEmpty}
          >
            <ListTodo className="w-5 h-5 mr-2" />  
            Ver Detalle de Movimiento        
          </button>
           )}       
        </div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-gray-600">
          Total de movimientos: {movements.length}
        </p>
      </div>

      {/* Movements DataGrid */}
      <div className="w-full">
      <DataGrid
          rows={movements}
          columns={columns}
          getRowId={(row) => row.movementId}
          checkboxSelection
          disableMultipleRowSelection
          className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
          onRowSelectionModelChange={(newRowSelectionModel) => setRowSelectionModel(newRowSelectionModel)}
          rowSelectionModel={rowSelectionModel}
        />
      </div>
    </div>
  );
};

export default InventoryMovements;
