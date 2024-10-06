import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";

type AuditTypeFormData = {
  auditTypeId: string;
  name: string;
};

type CreateAuditTypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: AuditTypeFormData) => void;
};

const CreateAuditTypeModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateAuditTypeModalProps) => {
  const [formData, setFormData] = useState({
    auditTypeId: v4(),
    name: "",
    
  });

  // Resetea el formulario cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      setFormData({ auditTypeId: v4(), name: ""  });
    }
  }, [isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newAuditType: AuditTypeFormData = {
      auditTypeId: formData.auditTypeId,
      name: formData.name,
      
    };
    onCreate(newAuditType);
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Crear Nuevo Tipo de Auditoría" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* AUDIT TYPE NAME */}
          <label htmlFor="auditTypeName" className={labelCssStyles}>
            Nombre de Tipo de Auditoría
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

        

          {/* CREATE ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Crear
          </button>
          <button
            onClick={() => {
              setFormData({ auditTypeId: v4(), name: ""  }); // Resetea el formulario al cerrar
              onClose();
            }}
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

export default CreateAuditTypeModal;
