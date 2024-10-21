import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";

type CustomerFormData = {
  id: string;
  name: string;
  lastname?: string;
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
    lastname: "",
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
  const inputCssStyles =
    "block w-full p-2 border-gray-300 border-2 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none transition";
  const containerCssStyles = "grid grid-cols-1 md:grid-cols-2 gap-4";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-8 border w-11/12 max-w-3xl shadow-lg rounded-md bg-white">
        <Header name="Crear Nuevo Cliente" />

        <form onSubmit={handleSubmit} className="mt-5">
          <div className={containerCssStyles}>
            {/* CUSTOMER NAME */}
            <div>
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
            </div>

            <div>
              <label htmlFor="lastname" className={labelCssStyles}>
                Apellidos
              </label>
              <input
                type="text"
                name="lastname"
                placeholder="Apellidos"
                onChange={handleChange}
                value={formData.lastname}
                className={inputCssStyles}
                required
              />
            </div>

            {/* CUSTOMER EMAIL */}
            <div>
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
            </div>

            {/* CUSTOMER PHONE */}
            <div>
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
            </div>

            {/* CUSTOMER ADDRESS */}
            <div>
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
            </div>

            {/* CUSTOMER CITY */}
            <div>
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
            </div>

            {/* CUSTOMER STATE */}
            <div>
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
            </div>

            {/* CUSTOMER COUNTRY */}
            <div>
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
            </div>

            {/* CUSTOMER POSTAL CODE */}
            <div>
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
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
            >
              Crear
            </button>
            <button
              onClick={onClose}
              type="button"
              className="px-5 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomerModal;
