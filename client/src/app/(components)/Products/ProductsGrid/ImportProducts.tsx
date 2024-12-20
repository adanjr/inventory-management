"use client";

import { useState } from "react";
import { parse } from "papaparse";
 
const ImportProductsModal = ({
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
  const [successCount, setSuccessCount] = useState(0); // Contador de vehículos creados
  const [errorCount, setErrorCount] = useState(0);     // Contador de errores
  const [loading, setLoading] = useState(false);       // Estado de loading
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

    setLoading(true); // Activar el estado de carga
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
            disabled={loading} // Deshabilitar mientras carga
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
            disabled={loading} // Deshabilitar mientras carga
          />
        </div>

        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded mr-2"
            onClick={onClose}
            disabled={loading} // Deshabilitar mientras carga
          >
            Cancelar
          </button>
          <button
            className={`${
              !selectedLocationId || loading
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-700 text-white"
            } font-semibold py-2 px-4 rounded flex items-center`}
            onClick={handleImport}
            disabled={!selectedLocationId || loading} // Deshabilitar mientras carga
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Cargando...
              </>
            ) : (
              "Importar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportProductsModal;
