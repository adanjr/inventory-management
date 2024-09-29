import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Header from "@/app/(components)/Header";

type VehicleTypeFormData = {
  vehicleTypeId: string;
  name: string;
};

type EditVehicleTypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (formData: VehicleTypeFormData) => void;
  initialData: VehicleTypeFormData;
};

const EditVehicleTypeModal = ({ isOpen, onClose, onEdit, initialData }: EditVehicleTypeModalProps) => {
  const [formData, setFormData] = useState<VehicleTypeFormData>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onEdit(formData);
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Editar Tipo de Vehículo" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* VEHICLE TYPE NAME */}
          <label htmlFor="vehicleTypeName" className={labelCssStyles}>
            Nombre de Tipo de Vehículo
          </label>
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          />
          {/* EDIT ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Editar
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditVehicleTypeModal;
