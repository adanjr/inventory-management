"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useGetVehiclesQuery,
         useGetLocationsQuery,           
         useDeleteVehicleMutation, 
         Vehicle } from "@/state/api";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import { PlusCircleIcon, EditIcon, DeleteIcon, UploadIcon } from "lucide-react"; 
import { parse } from 'papaparse';
import ImportVehiclesModal from "./ImportVehicles";

// Formato de moneda para México
const formatCurrency = (value: number | null | undefined) => {
  if (value == null || isNaN(value)) {
    return "$0.00"; // Valor predeterminado si el precio es nulo o no es válido
  }
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
};

const columns: GridColDef[] = [
  { field: "vehicleId", headerName: "ID", width: 30 },
  { field: "vin", headerName: "VIN", width: 150 },
  { field: "internal_serial", headerName: "Serial", width: 150 },
  { field: "stockNumber", headerName: "Stock Number", width: 150 },
  { field: "makeName", headerName: "Fabricante", width: 100 },
  { field: "familyName", headerName: "Familia", width: 100 },
  { field: "modelName", headerName: "Modelo", width: 100 },
  { field: "colorName", headerName: "Color", width: 100 },
  { field: "year", headerName: "Año", width: 40 },
  {
    field: "price",
    headerName: "Precio",
    width: 100,
    type: "number",
    valueFormatter: (params) => {       
      return formatCurrency(params); // Usa la función para formatear la moneda
    },
  },
  { field: "availabilityStatusName", headerName: "Disponibilidad", width: 100 },
];

const Vehicles = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("%");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const { data: locations = [], isLoading: locationsLoading } = useGetLocationsQuery();     
  const { data: vehicles, isError, isLoading } = useGetVehiclesQuery(debouncedSearchTerm || '%');  
  const [selectedLocationId, setSelectedLocationId] = useState<number | string>("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const [deleteVehicle] = useDeleteVehicleMutation();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);


  if (isLoading) return <div>Cargando...</div>;
  if (isError || !vehicles) return <div>Fallo al cargar vehículos</div>;

  const isSelectionEmpty = rowSelectionModel.length === 0;

  const handleDelete = async () => {
    const selectedVehicleId = rowSelectionModel[0];
  
    if (window.confirm("¿Estás seguro de que deseas eliminar este vehículo?")) {
      try {
        // Convertir el ID seleccionado a cadena antes de pasarlo a la mutación
        await deleteVehicle(String(selectedVehicleId)).unwrap();
        alert("Vehículo eliminado con éxito.");
      } catch (error) {
        console.error("Error eliminando el vehículo:", error);         
      }
    }
  };
   
  const handleImportClick = () => {
    setIsModalOpen(true);
  };


  return (
    <div className="mx-auto pb-5 w-full">
      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Buscar vehículos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Header y botones */}
      <div className="mb-6 flex flex-col">
        <div className="flex justify-between items-center">
          <Header name="Vehículos" />
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push("/vehicles/create")}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Agregar Vehículo
          </button>
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push(`/vehicles/edit/${rowSelectionModel[0]}`)}
            disabled={isSelectionEmpty}
          >
            <EditIcon className="w-5 h-5 mr-2" />
            Editar Vehículo
          </button>
          <button
            className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleDelete}
            disabled={isSelectionEmpty}
          >
            <DeleteIcon className="w-5 h-5 mr-2" />
            Eliminar Vehículo
          </button>
          <button className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleImportClick}>
            <UploadIcon className="w-5 h-5 mr-2" />
            Importar
          </button>              
        </div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-gray-600">
          Total de vehículos: {vehicles.length}
        </p>
      </div>

      {/* Vehicles DataGrid */}
      <div className="w-full">
        <DataGrid
          rows={vehicles}
          columns={columns}
          getRowId={(row) => row.vehicleId}
          checkboxSelection
          disableMultipleRowSelection
          className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
          onRowSelectionModelChange={(newRowSelectionModel) => setRowSelectionModel(newRowSelectionModel)}
          rowSelectionModel={rowSelectionModel}
        />
      </div>

      {/* Modal para seleccionar ubicación */}
      <ImportVehiclesModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} 
        locations={locations}
        selectedLocationId={selectedLocationId}
        setSelectedLocationId={setSelectedLocationId}
      />
    </div>
  );
};

export default Vehicles;
