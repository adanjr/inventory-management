"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useGetVehiclesQuery,
         useGetLocationsQuery,  
         useCreateVehicleFromCSVMutation,
         useDeleteVehicleMutation, 
         Vehicle } from "@/state/api";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import { PlusCircleIcon, EditIcon, DeleteIcon, UploadIcon } from "lucide-react"; 
import { parse } from 'papaparse';

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

  const [file, setFile] = useState<File | null>(null);
  const [createVehicleFromCSV] = useCreateVehicleFromCSVMutation();
  const { data: locations = [], isLoading: locationsLoading } = useGetLocationsQuery();     
  const [selectedLocationId, setSelectedLocationId] = useState<number | string>("");
  const [deleteVehicle] = useDeleteVehicleMutation();

  const acceptableCSVFilesTypes =".csv";

  const [formData, setFormData] = useState({    
    internal_serial: "",         
    modelName: "",    
    colorName: "",    
    availabilityStatusName: "",  
    locationId: 0,    
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data: vehicles, isError, isLoading } = useGetVehiclesQuery(debouncedSearchTerm || undefined);  

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

  const onFileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      readCSV(selectedFile);
    }
  };

  const readCSV = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parse(text, {
        complete: (results: { data: string[][]; }) => {
          const data = results.data as Array<string[]>; // Cambia esto si la estructura de datos es diferente

          // Procesar los datos y enviar al backend
          data.slice(1).forEach((row) => {
            const newVehicleCSV = {
              modelName: row[0], // Segundo campo es modelName
              internal_serial: row[2], // Asumiendo que el primer campo es internal_serial              
              colorName: row[3], // Tercer campo es colorName
              availabilityStatusName: row[5], // Cuarto campo es availabilityStatusName
              locationId: Number(selectedLocationId),
            };
            
            // Llama a la mutación para crear el vehículo desde CSV
            createVehicleFromCSV(newVehicleCSV)
              .unwrap()
              .then((response) => {
                console.log('Vehicle created:', response);
              })
              .catch((error) => {
                console.error('Failed to create vehicle:', error);
              });
          });
        },
      });
    };

    reader.readAsText(file);
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
          <button
                className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                onClick={() => {
                  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                  fileInput?.click();
                }}
            >
                <input
                  type="file"
                  accept={acceptableCSVFilesTypes}
                  className="hidden"
                  onChange={onFileChangeHandler}
                />
                <span className="flex items-center">
                    <UploadIcon className="w-5 h-5 mr-2" />
                    Cargar CSV
                </span>
          </button>
          <div className="flex flex-col">
              <label htmlFor="locationSelect" className="mb-1 font-semibold text-gray-700">Sucursal</label>
              <select
                id="locationSelect"
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(Number(e.target.value))}
                className="border-2 border-gray-300 rounded py-2 px-4"
              >             
                <option value="" disabled>Selecciona una ubicación</option>                 
                {locations.map((location) => (
                  <option key={location.locationId} value={location.locationId}>
                    {location.name}
                  </option>
                ))}
              </select>
          </div>                      
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
    </div>
  );
};

export default Vehicles;
