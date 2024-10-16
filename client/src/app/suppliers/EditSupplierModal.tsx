import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Header from "@/app/(components)/Header";
import { Supplier } from "@/state/api";

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

type EditSupplierModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (makeId: string, formData: Partial<SupplierFormData>) => void;
  selectedSupplier: SupplierFormData | null;
};


const EditSupplierModal = ({
  isOpen,
  onClose,
  onEdit,
  selectedSupplier,
}: EditSupplierModalProps) => {
  const [formData, setFormData] = useState({
    supplierId:  selectedSupplier?.supplierId || "",
    name:  selectedSupplier?.name || "",
    email:  selectedSupplier?.email || "",     
    address:  selectedSupplier?.address || "",
    postalCode: selectedSupplier?.postalCode || "",
    city: selectedSupplier?.city || "",
    state: selectedSupplier?.state || "",
    country: selectedSupplier?.country || "",     
    phone: selectedSupplier?.phone || "",
  });

  useEffect(() => {
    if (selectedSupplier && isOpen) {     
      setFormData({
        supplierId: selectedSupplier.supplierId,
        name: selectedSupplier.name, 
        email: selectedSupplier.email,
        address: selectedSupplier.address,
        postalCode: selectedSupplier.postalCode,
        city: selectedSupplier.city,
        state: selectedSupplier.state,
        country: selectedSupplier.country,   
        phone: selectedSupplier.phone,           
      });
    }
  }, [selectedSupplier, isOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onEdit(formData.supplierId, {
      name: formData.name,         
      email: formData.email,
      address: formData.address,
      postalCode: formData.postalCode,
      city: formData.city,
      state: formData.state,
      country: formData.country,   
      phone: formData.phone,    
       
    });
    onClose();
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
          <Header name="Editar Proveedor" />
          <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* NAME */}
            <div>
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
            </div>
    
            {/* ADDRESS */}
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
    
            {/* POSTAL CODE */}
            <div>
              <label htmlFor="postal_code" className={labelCssStyles}>
                Código Postal
              </label>
              <input
                type="text"
                name="postal_code"
                placeholder="Código Postal"
                onChange={handleChange}
                value={formData.postalCode}
                className={inputCssStyles}
              />
            </div>
    
            {/* CITY */}
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
    
            {/* STATE */}
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
    
            {/* COUNTRY */}
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
    
            {/* EMAIL */}
            <div>
              <label htmlFor="email" className={labelCssStyles}>
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                onChange={handleChange}
                value={formData.email}
                className={inputCssStyles}
              />
            </div>
    
            {/* PHONE */}
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
    
            {/* EDIT ACTIONS */}
            <div className="col-span-2">
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
            </div>
          </form>
        </div>
      </div>
    );
    
};

export default EditSupplierModal;
