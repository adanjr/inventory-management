import React, { ChangeEvent, FormEvent, useState } from "react";
import Header from "@/app/(components)/Header";

type ModelFormData = {
  name: string;
  makeId: number;
  year_start?: string;
  year_end?: string;
  type?: string; // Se mantiene como string
  battery_capacity?: number;
  electric_range?: number;
};

type CreateModelModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ModelFormData) => void;
  makes: { makeId: string; name: string }[]; // Lista de Fabricante
};

const CreateModelModal = ({
  isOpen,
  onClose,
  onCreate,
  makes,
}: CreateModelModalProps) => {
  const [formData, setFormData] = useState<ModelFormData>({
    name: "",
    makeId: 0,
    year_start: "",
    year_end: "",
    type: "", // Inicializar como string
    battery_capacity: 0,
    electric_range: 0,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "makeId" ? parseInt(value) : value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData); // Enviar solo los datos relevantes
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Crear Nuevo Modelo" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* MODEL NAME */}
          <label htmlFor="modelName" className={labelCssStyles}>
            Nombre de Modelo
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

          {/* MAKE SELECTION */}
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

          {/* YEAR START */}
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

          {/* YEAR END */}
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

          {/* TYPE */}
          <label htmlFor="type" className={labelCssStyles}>
            Tipo
          </label>
          <input
            type="text"
            name="type"
            placeholder="Tipo"
            onChange={handleChange}
            value={formData.type}
            className={inputCssStyles}
            required
          />

          {/* BATTERY CAPACITY */}
          <label htmlFor="battery_capacity" className={labelCssStyles}>
            Capacidad de Batería
          </label>
          <input
            type="number"
            name="battery_capacity"
            placeholder="Capacidad de Batería"
            onChange={handleChange}
            value={formData.battery_capacity}
            className={inputCssStyles}
          />

          {/* ELECTRIC RANGE */}
          <label htmlFor="electric_range" className={labelCssStyles}>
            Rango Eléctrico
          </label>
          <input
            type="number"
            name="electric_range"
            placeholder="Rango Eléctrico"
            onChange={handleChange}
            value={formData.electric_range}
            className={inputCssStyles}
          />

          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-600 text-white py-2 px-4 rounded"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Crear Modelo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModelModal;
