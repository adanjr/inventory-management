import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Header from "@/app/(components)/Header";

type CustomerFormData = {
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  city: string;
  state: string;
  country: string;
};

type EditCustomerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  customerData: CustomerFormData;
  onEdit: (formData: CustomerFormData) => void;
};

const EditCustomerModal = ({
  isOpen,
  onClose,
  customerData,
  onEdit,
}: EditCustomerModalProps) => {
  const [formData, setFormData] = useState<CustomerFormData>(customerData);

  useEffect(() => {
    if (customerData) {
      setFormData(customerData); // Cuando los datos cambian, actualizamos el formulario
    }
  }, [customerData]);

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
        <Header name="Editar Cliente" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* CUSTOMER NAME */}
          <label htmlFor="customerName" className={labelCssStyles}>
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

          {/* EMAIL */}
          <label htmlFor="customerEmail" className={labelCssStyles}>
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

          {/* PHONE */}
          <label htmlFor="phoneEmail" className={labelCssStyles}>
            Telefono
          </label>
          <input
            type="phone"
            name="phone"
            placeholder="Telefono"
            onChange={handleChange}
            value={formData.phone}
            className={inputCssStyles}
            required
          />

          {/* ADDRESS */}
          <label htmlFor="customerAddress" className={labelCssStyles}>
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

          {/* POSTAL CODE */}
          <label htmlFor="customerPostalCode" className={labelCssStyles}>
            Código Postal
          </label>
          <input
            type="text"
            name="postal_code"
            placeholder="Código Postal"
            onChange={handleChange}
            value={formData.postal_code}
            className={inputCssStyles}
          />

          {/* CITY */}
          <label htmlFor="customerCity" className={labelCssStyles}>
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

          {/* STATE */}
          <label htmlFor="customerState" className={labelCssStyles}>
            Estado
          </label>
          <input
            type="text"
            name="state"
            placeholder="Estado"
            onChange={handleChange}
            value={formData.state}
          />

          {/* COUNTRY */}
          <label htmlFor="customerCountry" className={labelCssStyles}>
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

          {/* EDIT ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
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

export default EditCustomerModal;
