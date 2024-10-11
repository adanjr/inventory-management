import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";

type FamilyFormData = {
  familyId: string;
  name: string;
  description: string;
  year_start?: string;
  year_end?: string;
  makeId: number,   
};

type CreateFamilyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: FamilyFormData) => void;
  makes: { makeId: string; name: string }[];
};

const CreateFamilyModal = ({
  isOpen,
  onClose,
  onCreate,
  makes,
}: CreateFamilyModalProps) => {
  const [formData, setFormData] = useState({
    familyId: v4(),
    name: "",
    description: "",
    makeId: 0,
    year_start: "",
    year_end: "",    
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.endsWith("Id")? parseFloat(value) : value,
    });
  };  

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      familyId: v4(),
      name: "",
      makeId: 0,
      year_start: "",
      year_end: "",
      description: "",      
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
        <Header name="Crear Nuevo Fabricante" />
        <form onSubmit={handleSubmit} className="mt-5">

          {/* MAKE SELECTION */}
          <div className="col-span-1">
            <label htmlFor="makeId" className={labelCssStyles}>
              Fabricante
            </label>
            <select
              name="makeId"
              onChange={handleChange}
              value={formData.makeId}
              className={inputCssStyles}
              required
            >
              <option value="">Selecciona un fabricante</option>
              {makes.map((make) => (
                <option key={make.makeId} value={make.makeId}>
                  {make.name}
                </option>
              ))}
            </select>
          </div>

          {/* FAMILY NAME */}
          <label htmlFor="familyName" className={labelCssStyles}>
            Nombre de la Family
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
            Descripcion
          </label>
          <input
            type="text"
            name="description"
            placeholder="Descripcion"
            onChange={handleChange}
            value={formData.description}
            className={inputCssStyles}
          />          

          {/* YEAR START */}
          <div className="col-span-1">
            <label htmlFor="year_start" className={labelCssStyles}>
              Año de Inicio
            </label>
            <input
              type="text"
              name="year_start"
              placeholder="Año de Inicio"
              onChange={handleChange}
              value={formData.year_start}
              className={inputCssStyles}
            />
          </div>

          {/* YEAR END */}
          <div className="col-span-1">
            <label htmlFor="year_end" className={labelCssStyles}>
              Año de Fin
            </label>
            <input
              type="text"
              name="year_end"
              placeholder="Año de Fin"
              onChange={handleChange}
              value={formData.year_end}
              className={inputCssStyles}
            />
          </div>

          {/* CREATE ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Crear
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

export default CreateFamilyModal;
