import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Header from "@/app/(components)/Header";

type BatteryWarrantyFormData = {
  batteryWarrantyId: string;
  name?: string;
  durationMonths: number;  
  description?: string;
};

type EditBatteryWarrantyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (batteryWarrantyId: string, formData: Partial<BatteryWarrantyFormData>) => void;
  selectedBatteryWarranty: BatteryWarrantyFormData | null;
};

const EditBatteryWarrantyModal = ({
  isOpen,
  onClose,
  onEdit,
  selectedBatteryWarranty,
}: EditBatteryWarrantyModalProps) => {
  const [formData, setFormData] = useState({
    batteryWarrantyId: selectedBatteryWarranty?.batteryWarrantyId || "",
    name: selectedBatteryWarranty?.name || "",
    durationMonths: selectedBatteryWarranty?.durationMonths || 0,    
    description: selectedBatteryWarranty?.description || "",
  });

  useEffect(() => {
    if (selectedBatteryWarranty && isOpen) {
      setFormData({
        batteryWarrantyId: selectedBatteryWarranty.batteryWarrantyId,
        name: selectedBatteryWarranty.name || "",
        durationMonths: selectedBatteryWarranty.durationMonths,        
        description: selectedBatteryWarranty.description || "",
      });
    }
  }, [selectedBatteryWarranty, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "durationMonths" ? parseInt(value) : value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onEdit(formData.batteryWarrantyId, {
      name: formData.name,
      durationMonths: formData.durationMonths,      
      description: formData.description,
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
        <Header name="Editar Garantía" />
        <form onSubmit={handleSubmit} className="mt-5">

          {/* NAME */}
          <label htmlFor="name" className={labelCssStyles}>
            Nombre
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

          {/* DESCRIPTION */}
          <label htmlFor="description" className={labelCssStyles}>
            Descripción
          </label>
          <input
            type="text"
            name="description"
            placeholder="Descripción"
            onChange={handleChange}
            value={formData.description}
            className={inputCssStyles}
          />

          {/* DURATION MONTHS */}
          <label htmlFor="durationMonths" className={labelCssStyles}>
            Meses de Duración
          </label>
          <input
            type="number"
            name="durationMonths"
            placeholder="Meses de Duración"
            onChange={handleChange}
            value={formData.durationMonths}
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

export default EditBatteryWarrantyModal;
