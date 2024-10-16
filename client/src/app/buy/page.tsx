"use client";

import { useState } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import ImportVehiclesModal from "./ImportVehiclesModal";
import SearchProviderModal from "./SearchProviderModal";
import { CheckCircleIcon, UploadIcon, PaperclipIcon, PencilLine } from "lucide-react";
import { useGetSuppliersQuery, 
         useGetLocationsQuery,
         Vehicle,
 } from "@/state/api";
import { Autocomplete, TextField } from "@mui/material";

// Formato de moneda para México
const formatCurrency = (value: number | null | undefined) => {
  return value == null || isNaN(value)
    ? "$0.00"
    : new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(value);
};

const locations = [
  { id: 1, name: "Almacén Central" },
  { id: 2, name: "Sucursal Norte" },
];

const paymentTerms = ["Contado", "30 días", "60 días", "90 días"];
const shipmentPreferences = ["Urgente", "Normal", "Flexible"];

const columns: GridColDef[] = [
  { field: "vehicleId", headerName: "ID", width: 30 },   
  { field: "serialNumber", headerName: "Serial", width: 150 },
  { field: "modelName", headerName: "Modelo", width: 100 },
  { field: "colorName", headerName: "Color", width: 100 }, 
  {
    field: "price",
    headerName: "Precio",
    width: 100,
    type: "number",
    valueFormatter: (params) => formatCurrency(params),
  },   
];

const Buy = () => {
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  const [providerName, setProviderName] = useState("");
  const [purchaseOrder, setPurchaseOrder] = useState("");
  const [reference, setReference] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [deliveryEstimate, setDeliveryEstimate] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("");
  const [shipmentPreference, setShipmentPreference] = useState("");
  const [totalPurchase, setTotalPurchase] = useState(0);
  const [isSearchProviderModalOpen, setIsSearchProviderModalOpen] = useState(false);
  //const [vehiclesToLoad, setVehiclesToLoad] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [termsConditions, setTermsConditions] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);

  const [vehiclesToLoad, setVehiclesToLoad] = useState<Vehicle[]>([]);


  const { data: suppliers = [], isLoading } = useGetSuppliersQuery();


  const handlePurchase = async () => {
    if (
      rowSelectionModel.length === 0 ||
      !providerName ||
      !purchaseOrder ||
      !purchaseDate ||
      !deliveryEstimate ||
      !paymentTerm ||
      !shipmentPreference
    ) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }
    const selectedVehicleIds = rowSelectionModel;
    alert(`Compra procesada para los vehículos ID: ${selectedVehicleIds.join(", ")}. Proveedor: ${providerName}`);
  };

  return (
    <div className="mx-auto pb-5 w-full">
      {/* Título y búsqueda de proveedor */}
      <Header name="Nueva Orden de Compra" />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
        <Autocomplete
            options={suppliers.map((supplier) => supplier.name)}
            loading={isLoading}
            value={providerName}
            onChange={(event, newValue) => setProviderName(newValue || "")} // Si newValue es null, asignar una cadena vacía
            renderInput={(params) => (
              <TextField
                {...params}
                label="Proveedor"
                variant="outlined"
                placeholder="Selecciona un proveedor"
              />
            )}
            noOptionsText="No se encontraron proveedores"
          />
        </div>
      </div>

      {/* Radio button para recibir en almacén o ir por mercancía */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">¿Cómo recibirás la mercancía?</label>
        <div className="flex space-x-4">
          <label>
            <input type="radio" name="receiptMethod" value="almacen" /> En almacén
          </label>
          <label>
            <input type="radio" name="receiptMethod" value="pickup" /> Iré por ella
          </label>
        </div>
      </div>

      {/* Campos adicionales para detalles de la compra */}
      <div className="mb-4">
        <label className="block mb-2">Orden de Compra:</label>
        <input
          type="text"
          value={purchaseOrder}
          onChange={(e) => setPurchaseOrder(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Número de orden de compra"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Referencia:</label>
        <input
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Referencia opcional"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Fecha de Compra:</label>
        <input
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Fecha Estimada de Entrega:</label>
        <input
          type="date"
          value={deliveryEstimate}
          onChange={(e) => setDeliveryEstimate(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Términos de Pago:</label>
        <select
          value={paymentTerm}
          onChange={(e) => setPaymentTerm(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Selecciona un término</option>
          {paymentTerms.map((term) => (
            <option key={term} value={term}>
              {term}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Preferencias de Envío:</label>
        <select
          value={shipmentPreference}
          onChange={(e) => setShipmentPreference(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Selecciona una preferencia</option>
          {shipmentPreferences.map((preference) => (
            <option key={preference} value={preference}>
              {preference}
            </option>
          ))}
        </select>
      </div>

      {/* Grid de vehículos */}
      <h2 className="text-xl font-bold mb-2">Vehículos a Comprar</h2>
      <DataGrid
        rows={vehiclesToLoad}
        columns={columns}
        getRowId={(row) => row.vehicleId}
        checkboxSelection
        disableMultipleRowSelection
        className="bg-white shadow rounded-lg border border-gray-200 mb-4"
        onRowSelectionModelChange={(newRowSelectionModel) =>
          setRowSelectionModel(newRowSelectionModel)
        }
        rowSelectionModel={rowSelectionModel}
      />

      {/* Botón para importar vehículos */}
      <div className="mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <UploadIcon className="w-5 h-5 inline-block mr-2" />
          Importar Vehículos
        </button>
      </div>

      {/* Total de la compra */}
      <div className="flex justify-end">
        <div className="bg-gray-200 p-4 rounded-lg shadow-lg text-lg">
          <strong>Total Compra: </strong>{formatCurrency(totalPurchase)}
        </div>
      </div>

      {/* Adjuntar archivo y términos y condiciones */}
      <div className="mt-4">
        <div className="mb-4">
          <label className="block mb-2">Adjuntar Archivo (opcional):</label>
          <input type="file" onChange={(e) => setAttachedFile(e.target.files ? e.target.files[0] : null)} />
          {attachedFile && <p>Archivo seleccionado: {attachedFile.name}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2">Términos y Condiciones:</label>
          <textarea
            value={termsConditions}
            onChange={(e) => setTermsConditions(e.target.value)}
            className="border p-2 rounded w-full"
            rows={4}
            placeholder="Ingresa los términos y condiciones de la orden de compra"
          ></textarea>
        </div>
      </div>

      {/* Botón para procesar la compra */}
      <div className="flex justify-end">
      <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handlePurchase}
        >
          <PencilLine className="w-5 h-5 inline-block mr-2" />
          Guardar como Borrador
        </button>

        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handlePurchase}
        >
          <CheckCircleIcon className="w-5 h-5 inline-block mr-2" />
          Procesar Compra
        </button>
      </div>

      {/* Modal de búsqueda de proveedor */}
      <SearchProviderModal
        isOpen={isProviderModalOpen}
        onClose={() => setIsProviderModalOpen(false)}
        onSelectProvider={(provider) => {
          setProviderName(provider.name); // Actualiza el nombre del proveedor en el componente padre
        }}
      />

      {/* Modal de importación de vehículos */}
      <ImportVehiclesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVehiclesImported={(vehicles) => {
          setVehiclesToLoad(vehicles);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default Buy;
