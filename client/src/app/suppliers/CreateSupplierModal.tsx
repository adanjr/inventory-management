import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";

type SupplierFormData = {
  supplierId: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
};

type CreateSupplierModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: SupplierFormData) => void;
};

const CreateSupplierModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateSupplierModalProps) => {
  const [formData, setFormData] = useState({
    supplierId: v4(),
    name: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    state: "",
    country: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <Header name="Crear Nuevo Proveedor" />
        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* SUPPLIER NAME */}
          <div>
            <label htmlFor="supplierName" className={labelCssStyles}>
              Nombre del Proveedor
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
          </div>

          {/* EMAIL */}
          <div>
            <label htmlFor="supplierEmail" className={labelCssStyles}>
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              onChange={handleChange}
              value={formData.email}
              className={inputCssStyles}
              required
            />
          </div>

          {/* PHONE */}
          <div>
            <label htmlFor="phoneEmail" className={labelCssStyles}>
              Teléfono
            </label>
            <input
              type="phone"
              name="phone"
              placeholder="Teléfono"
              onChange={handleChange}
              value={formData.phone}
              className={inputCssStyles}
              required
            />
          </div>

          {/* ADDRESS */}
          <div>
            <label htmlFor="supplierAddress" className={labelCssStyles}>
              Dirección
            </label>
            <input
              type="text"
              name="address"
              placeholder="Dirección"
              onChange={handleChange}
              value={formData.address}
              className={inputCssStyles}
            />
          </div>

          {/* POSTAL CODE */}
          <div>
            <label htmlFor="supplierPostalCode" className={labelCssStyles}>
              Código Postal
            </label>
            <input
              type="text"
              name="postalCode"
              placeholder="Código Postal"
              onChange={handleChange}
              value={formData.postalCode}
              className={inputCssStyles}
            />
          </div>

          {/* CITY */}
          <div>
            <label htmlFor="supplierCity" className={labelCssStyles}>
              Ciudad
            </label>
            <input
              type="text"
              name="city"
              placeholder="Ciudad"
              onChange={handleChange}
              value={formData.city}
              className={inputCssStyles}
            />
          </div>

          {/* STATE */}
          <div>
            <label htmlFor="supplierState" className={labelCssStyles}>
              Estado
            </label>
            <input
              type="text"
              name="state"
              placeholder="Estado"
              onChange={handleChange}
              value={formData.state}
              className={inputCssStyles}
            />
          </div>

          {/* COUNTRY */}
          <div>
            <label htmlFor="supplierCountry" className={labelCssStyles}>
              País
            </label>
            <input
              type="text"
              name="country"
              placeholder="País"
              onChange={handleChange}
              value={formData.country}
              className={inputCssStyles}
            />
          </div>

          {/* CREATE ACTIONS */}
          <div className="col-span-2 flex justify-end">
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

export default CreateSupplierModal;
