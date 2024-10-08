import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";

type CustomerFormData = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
};

type CreateCustomerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: CustomerFormData) => void;
};

const CreateCustomerModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateCustomerModalProps) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    id: v4(),
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
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
  const inputCssStyles = "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Crear Nuevo Cliente" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* CUSTOMER NAME */}
          <label htmlFor="name" className={labelCssStyles}>
            Nombre del Cliente
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

          {/* CUSTOMER EMAIL */}
          <label htmlFor="email" className={labelCssStyles}>
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            className={inputCssStyles}
            required
          />

          {/* CUSTOMER PHONE */}
          <label htmlFor="phone" className={labelCssStyles}>
            Teléfono
          </label>
          <input
            type="text"
            name="phone"
            placeholder="Teléfono"
            onChange={handleChange}
            value={formData.phone}
            className={inputCssStyles}
          />

          {/* CUSTOMER ADDRESS */}
          <label htmlFor="address" className={labelCssStyles}>
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

          {/* CUSTOMER CITY */}
          <label htmlFor="city" className={labelCssStyles}>
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

          {/* CUSTOMER STATE */}
          <label htmlFor="state" className={labelCssStyles}>
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

          {/* CUSTOMER COUNTRY */}
          <label htmlFor="country" className={labelCssStyles}>
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

          {/* CUSTOMER POSTAL CODE */}
          <label htmlFor="postalCode" className={labelCssStyles}>
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

          {/* ACTIONS */}
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

export default CreateCustomerModal;
