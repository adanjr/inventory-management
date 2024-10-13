"use client";

import { useState } from "react";
import { parse } from 'papaparse';

type ImportVehiclesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (vehicles: any[]) => void;
};

const ImportVehiclesModal = ({ isOpen, onClose, onUpload }: ImportVehiclesModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        parse(csv, {
          complete: (results) => {
            const data = results.data.slice(1); // Ignorar la fila de encabezados
            const vehicles = data.map((row: any) => ({
              vin: row[0],
              internal_serial: row[1],
              stockNumber: row[2],
              makeName: row[3],
              modelName: row[4],
              colorName: row[5],
              year: row[6],
              price: parseFloat(row[7]) || 0,
              location: "", // Se asignará después
            }));
            onUpload(vehicles);
            onClose();
          }
        });
      };
      reader.readAsText(selectedFile);
    }
  };

  return (
    isOpen ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">Importar Vehículos</h2>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <div className="mt-4 flex justify-end">
            <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={onClose}>Cancelar</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpload}>Subir</button>
          </div>
        </div>
      </div>
    ) : null
  );
};

export default ImportVehiclesModal;
