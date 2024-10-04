import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";

type VehicleStatusFormData = {
  vehicleStatusId: string;
  name: string;
};

type CreateVehicleStatusModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: VehicleStatusFormData) => void;
};

const CreateVehicleStatusModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateVehicleStatusModalProps) => {
  const [formData, setFormData] = useState<VehicleStatusFormData>({
    vehicleStatusId: v4(),
    name: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validación simple para asegurarse de que el nombre no esté vacío
    if (!formData.name.trim()) {
      alert("El nombre del estado de vehículo es obligatorio.");
      return;
    }
    onCreate(formData);
    setFormData({ vehicleStatusId: v4(), name: "" }); // Reiniciar el formulario después de enviar
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Crear Nuevo Estado de Vehículo" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* VEHICLE STATUS NAME */}
          <label htmlFor="vehicleStatusName" className={labelCssStyles}>
            Nombre de Estado de Vehículo
          </label>
          <input
            type="text"
            name="name"
            id="vehicleStatusName" // Agregado para una mejor accesibilidad
            placeholder="Nombre"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          />

          {/* CREATE ACTIONS */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Crear
            </button>
            <button
              onClick={onClose}
              type="button"
              className="mt-4 ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVehicleStatusModal;
