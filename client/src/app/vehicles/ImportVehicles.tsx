"use client";

import { useState } from "react";
import { parse } from "papaparse";
import { useCreateVehicleFromCSVMutation } from "@/state/api";

const ImportVehiclesModal = ({
  isOpen,
  onClose,
  locations,
  selectedLocationId,
  setSelectedLocationId
}: {
  isOpen: boolean;
  onClose: () => void;
  locations: { locationId: number | string; name: string }[];
  selectedLocationId: number | string;
  setSelectedLocationId: (locationId: number | string) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [createVehicleFromCSV] = useCreateVehicleFromCSVMutation();

  const acceptableCSVFilesTypes = ".csv";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = () => {
    if (!file || !selectedLocationId) {
      alert("Por favor, selecciona una sucursal y carga un archivo CSV.");
      return;
    }

    readCSV(file); // Procesar el archivo CSV
    onClose(); // Cerrar el modal después de la importación
  };

  const readCSV = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      parse(text, {
        complete: (results: { data: string[][] }) => {
          const data = results.data as Array<string[]>;

          // Procesar los datos y enviar al backend
          data.slice(1).forEach((row) => {
            const newVehicleCSV = {
              modelName: row[0],
              internal_serial: row[2],
              colorName: row[3],
              availabilityStatusName: row[5],
              engineNumber: row[6],
              locationId: Number(selectedLocationId),
            };

            createVehicleFromCSV(newVehicleCSV)
              .unwrap()
              .then((response) => {
                console.log("Vehículo creado:", response);
              })
              .catch((error) => {
                console.error("Error al crear vehículo:", error);
              });
          });
        },
      });
    };

    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Importar Vehículos</h2>

        <div className="mb-4">
          <label htmlFor="locationSelect" className="block text-sm font-medium text-gray-700">
            Sucursal
          </label>
          <select
            id="locationSelect"
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(Number(e.target.value))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="" disabled>
              Selecciona una ubicación
            </option>
            {locations.map((location) => (
              <option key={location.locationId} value={location.locationId}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="csvUpload" className="block text-sm font-medium text-gray-700">
            Archivo CSV
          </label>
          <input
            type="file"
            id="csvUpload"
            accept={acceptableCSVFilesTypes}
            onChange={handleFileChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded mr-2"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className={`${
              !selectedLocationId
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-700 text-white"
            } font-semibold py-2 px-4 rounded`}
            onClick={handleImport}
            disabled={!selectedLocationId}
          >
            Importar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportVehiclesModal;
