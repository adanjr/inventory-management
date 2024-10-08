import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Header from "@/app/(components)/Header";
import { FuelType } from "@/state/api";

type FuelTypeFormData = {
  fuelTypeId: string;
  name: string;
  
};

type EditFuelTypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (fuelTypeId: string, formData: Partial<FuelTypeFormData>) => void;
  selectedFuelType: FuelType | null;
};

const EditFuelTypeModal = ({
  isOpen,
  onClose,
  onEdit,
  selectedFuelType,
}: EditFuelTypeModalProps) => {
  const [formData, setFormData] = useState<FuelTypeFormData>({
    fuelTypeId: selectedFuelType?.fuelTypeId || "",
    name: selectedFuelType?.name || "",
    
  });

  useEffect(() => {
    if (selectedFuelType && isOpen) {
      // Actualiza el formulario con los datos de el tipo de carga seleccionada
      setFormData({
        fuelTypeId: selectedFuelType.fuelTypeId,
        name: selectedFuelType.name,
      
      });
    }
  }, [selectedFuelType, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onEdit(formData.fuelTypeId, {
      name: formData.name,
     
    });
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Editar Tipo de Carga" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* FUEL TYPE NAME */}
          <label htmlFor="name" className={labelCssStyles}>
            Nombre de Tipo de Carga
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
            Guardar Cambios
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

export default EditFuelTypeModal;
