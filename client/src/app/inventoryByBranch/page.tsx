"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useGetGroupedVehiclesQuery, 
         GroupedVehicleData, 
         GetGroupedVehiclesResponse,
         useGetLocationsByUsernameQuery , 
         Location, 
         useGetAuthUserQuery} from "@/state/api";
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
  const router = useRouter();
  const { data: currentUser, isLoading: isLoadingUser } = useGetAuthUserQuery({});

  const [locationId, setLocationId] = useState<number | null>(null); // Estado para la ubicación
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);

  // Consulta de vehículos agrupados por modelo, color y estado
  const { data: groupedVehiclesData, isError: isGroupedVehiclesError, isLoading: isGroupedVehiclesLoading } = useGetGroupedVehiclesQuery(locationId);
  
  // Consulta de ubicaciones
  const { data: locations, isError: isLocationsError, isLoading: isLocationsLoading } = 
  useGetLocationsByUsernameQuery(currentUser?.userDetails.username!, { skip: !currentUser });
  
  useEffect(() => {
    if (currentUser && currentUser.userDetails) {
      const currentLocationId = currentUser.userDetails.locationId;
      setLocationId(currentLocationId !== undefined ? currentLocationId : null);
    }
  }, [currentUser]);

  if (isLoadingUser || isGroupedVehiclesLoading) return <div>Cargando...</div>;
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

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(rows); // Convierte los datos a una hoja de Excel
    const wb = XLSX.utils.book_new(); // Crea un nuevo libro de Excel
    XLSX.utils.book_append_sheet(wb, ws, "Inventario"); // Agrega la hoja al libro
    XLSX.writeFile(wb, "inventario_vehiculos.xlsx"); // Descarga el archivo
  };

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
         
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push('/inventoryMovements')}
          >
            <PackagePlus className="w-5 h-5 mr-2" />  
            Gestión de Inventario    
          </button>          
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {}}
          >
            <Printer className="w-5 h-5 mr-2" />
            Imprimir Inventario
          </button>        
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={exportToExcel}
          >
            <Download className="w-5 h-5 mr-2" />
            Exportar Inventario
          </button>
        </div>
      </div>
  
      {/* Inventory DataGrid */}
      <div className="w-full">
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
      </div>
    </div>
  );
};

export default InventoryByBranch;
