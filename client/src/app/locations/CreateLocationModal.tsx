import React, { ChangeEvent, FormEvent, useState } from "react";
import { v4 } from "uuid";
import Header from "@/app/(components)/Header";
import MapboxMap from "../(components)/MapboxMap";

type LocationFormData = {
  locationId: string;
  name: string;
  type: string;
  address: string;
  postal_code: string;
  city: string;
  state: string;
  country: string;
  latitude: number; 
  longitude: number;
};

type CreateLocationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: LocationFormData) => void;
};

const CreateLocationModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateLocationModalProps) => {
  const [formData, setFormData] = useState({
    locationId: v4(),
    name: "",
    type: "",
    address: "",
    postal_code: "",
    city: "",
    state: "",
    country: "",
    latitude: 0,
    longitude: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng,
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChange2 = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      type: e.target.value, // Actualiza el valor del campo 'type'
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
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Crear Nueva Ubicacion" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* LOCATION NAME */}
          <label htmlFor="locationName" className={labelCssStyles}>
            Nombre de Ubicacion
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

          {/* TYPE */}
          <label htmlFor="locationType" className={labelCssStyles}>
            Tipo
          </label>
          <input
            list="location-types"    // Vincula el datalist con el input
            name="Tipo"
            placeholder="Tipo"
            onChange={handleChange2}
            value={formData.type}
            className={inputCssStyles}
            required
          />

            <datalist id="location-types">
              <option value="Sucursal" />
              <option value="Almacén" />
            </datalist>

          {/* ADDRESS */}
          <label htmlFor="address" className={labelCssStyles}>
            Direccion
          </label>
          <input
            type="text"
            name="address"
            placeholder="Direccion"
            onChange={handleChange}
            value={formData.address}
            className={inputCssStyles}
          />

          {/* POSTAL CODE */}
          <label htmlFor="supplierPostalCode" className={labelCssStyles}>
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

          {/* STATE */}
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

          {/* COUNTRY */}
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
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLocationModal;
