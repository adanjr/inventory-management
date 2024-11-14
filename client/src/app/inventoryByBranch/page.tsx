"use client";

import { useState, useEffect, SetStateAction } from "react";
import { useRouter } from 'next/navigation';
import { 
        useGetAuthUserQuery, 
        useGetRolePermissionsByModuleQuery,
         useGetGroupedVehiclesQuery, 
         GroupedVehicleData, 
         GetGroupedVehiclesResponse,
         useGetProductsByLocationIdQuery,
         useGetLocationsQuery, 
         PermissionPage,
         Location } from "@/state/api";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import { PlusCircleIcon, 
         EditIcon, 
         DeleteIcon,
         MoveHorizontal,
         Printer,
         PackagePlus,
         Download,
 } from "lucide-react";
 import * as XLSX from 'xlsx'; 

const InventoryByBranch = () => {
  const { data: currentUser } = useGetAuthUserQuery({});
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('vehiculos');
  const [locationId, setLocationId] = useState<number | null>(null); // Estado para la ubicación
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

  // Consulta de vehículos agrupados por modelo, color y estado
  const { data: groupedVehiclesData, isError: isGroupedVehiclesError, isLoading: isGroupedVehiclesLoading } = useGetGroupedVehiclesQuery(locationId);
  const { data: products, isError, isLoading} = useGetProductsByLocationIdQuery(locationId ? locationId.toString() : '0');

  // Consulta de ubicaciones
  const { data: locations, isError: isLocationsError, isLoading: isLocationsLoading } = useGetLocationsQuery();

  const userPermissions = permissionsData?.permissions || [];

  if (isGroupedVehiclesLoading) return <div>Cargando...</div>;
  if (isGroupedVehiclesError || !groupedVehiclesData) return <div>Fallo al cargar datos agrupados</div>;

  const groupedData = groupedVehiclesData?.groupedData || [];

  const rows = groupedVehiclesData.groupedData.map((vehicle: GroupedVehicleData, index: number) => ({
    id: index,
    modelName: vehicle.modelName,
    colorName: vehicle.colorName,
    availabilityStatus: vehicle.availabilityStatus,
    count: vehicle.count,
  }));

  // Definir las columnas del DataGrid
  const columns: GridColDef[] = [
    { field: "modelName", headerName: "Modelo", width: 150 },
    { field: "colorName", headerName: "Color", width: 150 },
    { field: "availabilityStatus", headerName: "Disponibilidad", width: 150 },
    { field: "count", headerName: "Total", width: 100 },
  ];

  const productColumns: GridColDef[] = [
    { field: "productCode", headerName: "Codigo", width: 150 },
    { field: "name", headerName: "Nombre", width: 150 },
    { field: "quantityStockInLocation", headerName: "Cantidad en Stock", width: 150 },
    //{ field: "stockQuantity", headerName: "Cantidad en Stock", width: 150 },
  ];

  const handleTabChange = (tab: SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(rows); // Convierte los datos a una hoja de Excel
    const wb = XLSX.utils.book_new(); // Crea un nuevo libro de Excel
    XLSX.utils.book_append_sheet(wb, ws, "Inventario"); // Agrega la hoja al libro
    XLSX.writeFile(wb, "inventario_vehiculos.xlsx"); // Descarga el archivo
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
          <Header name="Inventario a Detalle de Vehículos" />
        </div>

        {/* Filtro por ubicación */}
        <div className="mt-4 mb-4 flex items-center">
          <label htmlFor="locationFilter" className="mr-2">Ubicación:</label>
          <select
            id="locationFilter"
            className="py-2 px-4 rounded border-2 border-gray-200 bg-white"
            value={locationId || ""}
            onChange={(e) => setLocationId(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">Seleccionar Ubicación</option>
            {locations && locations.length > 0 ? (
              locations.map((location: Location) => (
                <option key={location.locationId} value={location.locationId}>
                  {location.name} {/* Asume que `name` es la propiedad para mostrar el nombre de la ubicación */}
                </option>
              ))
            ) : (
              <option disabled>No hay ubicaciones disponibles</option>
            )}
          </select>
        </div>

        <div className="flex space-x-4">
        {permissions.canAccess && ( 
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push('/inventoryMovements')}
          >
            <PackagePlus className="w-5 h-5 mr-2" />  
            Gestión de Inventario    
          </button>  )}   
          {permissions.canExport && (      
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {}}
          >
            <Printer className="w-5 h-5 mr-2" />
            Imprimir Inventario
          </button>       )}    
          {permissions.canExport && (      
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={exportToExcel}
          >
            <Download className="w-5 h-5 mr-2" />
            Exportar Inventario
          </button> )} 
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
      <button
          onClick={() => handleTabChange('vehiculos')}
          className={`px-4 py-2 ${activeTab === 'vehiculos' ? 'border-b-2 border-blue-500 font-bold shadow-md text-blue-500' : 'text-gray-500'}`}
          >
          Vehículos
        </button>
        <button
          onClick={() => handleTabChange('productos')}
          className={`px-4 py-2 ${activeTab === 'productos' ? 'border-b-2 border-blue-500 font-bold shadow-md text-blue-500' : 'text-gray-500'}`}
            >
          Productos
        </button>
      </div>
  
      {/* Inventory DataGrid */}
      <div className="w-full mt-5">
        {activeTab === 'vehiculos' && (
          <DataGrid
          rows={groupedData}
          columns={columns}
          getRowId={(row) => `${row.modelName}-${row.colorName}-${row.availabilityStatus}`} // Combina los campos para crear un ID único
          checkboxSelection
          disableMultipleRowSelection           
          className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
          onRowSelectionModelChange={(newRowSelectionModel) => setRowSelectionModel(newRowSelectionModel)}
          rowSelectionModel={rowSelectionModel}
        />
        )}
        
        {activeTab === 'productos' && (
          <DataGrid
            rows={products}
            columns={productColumns}
            getRowId={(row) => row.productId} // Asume un ID único para productos
            checkboxSelection
            disableMultipleRowSelection
            className="bg-white shadow rounded-lg border border-gray-200 !text-gray-700"
          />
        )}
        
      </div>
    </div>
  );
};

export default InventoryByBranch;