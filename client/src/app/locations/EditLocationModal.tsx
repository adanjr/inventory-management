import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Header from "@/app/(components)/Header";

type LocationFormData = {
  location_id: string;
  name: string;
  address: string;
  postal_code: string;
  city: string;
  state: string;
  country: string;
  email: string;
  phone: string;
};

type EditLocationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (formData: LocationFormData) => void;
  locationData: LocationFormData | null; // Data to pre-fill the form
};

const EditLocationModal = ({
  isOpen,
  onClose,
  onUpdate,
  locationData,
}: EditLocationModalProps) => {
  const [formData, setFormData] = useState<LocationFormData>({
    location_id: "",
    name: "",
    address: "",
    postal_code: "",
    city: "",
    state: "",
    country: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (locationData) {
      setFormData(locationData); // Pre-fill the form with the location data
    }
  }, [locationData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Editar Proveedor" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* NAME */}
          <label htmlFor="name" className={labelCssStyles}>
            Nombre de Proveedor
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

          {/* ADDRESS */}
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

          {/* POSTAL CODE */}
          <label htmlFor="postal_code" className={labelCssStyles}>
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

          {/* STATE */}
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

          {/* COUNTRY */}
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

export default EditLocationModal;
