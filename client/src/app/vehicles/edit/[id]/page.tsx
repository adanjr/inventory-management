"use client";

import { useEffect, useState } from "react";
import { 
  useCreateVehicleMutation,
  useGetVehicleByIdQuery, // Import the query for fetching vehicle data
  useGetWarrantiesQuery,
  useGetBatteryWarrantiesQuery,
  useGetMakesQuery,
  useGetModelsQuery,
  useGetColorsQuery,  
  useGetVehicleStatusesQuery,
  useGetVehicleConditionsQuery,
  useGetVehicleAvailabilityStatusesQuery,
  useGetLocationsQuery,
} from "@/state/api";
import { useRouter } from 'next/navigation';

const EditVehicle = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const id = params.id;
  const { data: vehicle, isLoading: vehicleLoading } = useGetVehicleByIdQuery(id); // Fetch vehicle data

  const { data: makes, isLoading: makesLoading } = useGetMakesQuery();
  const { data: models, isLoading: modelsLoading } = useGetModelsQuery();
  const { data: colors, isLoading: colorsLoading } = useGetColorsQuery();
  const { data: vehicleStatuses, isLoading: vehicleStatusesLoading } = useGetVehicleStatusesQuery();
  const { data: vehicleConditions, isLoading: vehicleConditionsLoading } = useGetVehicleConditionsQuery();
  const { data: vehicleAvailabilityStatuses, isLoading: vehicleAvailabilityStatusesLoading } = useGetVehicleAvailabilityStatusesQuery();   
  const { data: warranties, isLoading: warrantiesLoading } = useGetWarrantiesQuery(); 
  const { data: batteryWarranties, isLoading: batteryWarrantiesLoading } = useGetBatteryWarrantiesQuery(); 
  const { data: locations, isLoading: locationsLoading } = useGetLocationsQuery();  
  const [updateVehicle] = useCreateVehicleMutation(); // Update mutation

  const [formData, setFormData] = useState({
    vin: "",
    internal_serial: "",    
    makeId: 0,
    modelId: 0,
    year: 2024,
    colorId: 0,    
    availabilityStatusId: 0,
    conditionId: 0,
    statusId: 0,
    warrantyId: 0,
    batteryWarrantyId: 0,
    locationId: 0,
    mileage: 0,             
    price: 0,
    stockNumber: "",
    barcode: "",
    qrCode: "",
    description: "",
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vin: vehicle.vin!,
        internal_serial: vehicle.internal_serial!,
        makeId: vehicle.makeId,
        modelId: vehicle.modelId,
        year: vehicle.year,
        colorId: vehicle.colorId,
        availabilityStatusId: vehicle.availabilityStatusId,
        conditionId: vehicle.conditionId,
        statusId: vehicle.statusId,
        warrantyId: vehicle.warrantyId,
        batteryWarrantyId: vehicle.batteryWarrantyId,
        locationId: vehicle.locationId,
        mileage: vehicle.mileage,
        price: vehicle.price,
        stockNumber: vehicle.stockNumber,
        barcode: vehicle.barcode!,
        qrCode: vehicle.qrCode!,
        description: vehicle.description!,
      });
    }
  }, [vehicle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    // Convert to number if the field is an ID
    const isIdField = [     
      "modelId",
      "colorId",
      "availabilityStatusId",
      "conditionId",      
      "statusId",     
      "locationId",
      "warrantyId",
      "batteryWarrantyId",
      "mileage",  // If you want it to be a number       
      "price",
      "year",
    ].includes(name);
  
    setFormData((prev) => ({
      ...prev,
      [name]: isIdField ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateVehicle(formData); // Use updateVehicle instead of createVehicle
    router.push("/vehicles"); // Redirect to vehicle list after updating
  };

  if (vehicleLoading) {
    return <p>Cargando vehículo...</p>; // Loading message
  }

  const handleBack = () => {
    router.push("/vehicles"); // Redirigir a la lista de vehículos
  };

  return (
    <div className="mx-auto p-6 max-w-6xl bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Editar Vehículo</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          {/* Form fields */}
          <div>
            <label className="block text-gray-700 font-semibold">VIN</label>
            <input
              type="text"
              name="vin"
              value={formData.vin}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>           
          
          <div>
            <label className="block text-gray-700 font-semibold">Número de Serie Interno</label>
            <input
              type="text"
              name="internal_serial"
              value={formData.internal_serial}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>
         
          <div>
            <label className="block text-gray-700 font-semibold">Fabricante</label>
            {makesLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="makeId"
                value={formData.makeId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione un fabricante</option>
                {makes?.map((make: any) => (
                  <option key={make.makeId} value={make.makeId}>
                    {make.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Modelo</label>
            {modelsLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="modelId"
                value={formData.modelId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione un modelo</option>
                {models?.map((model: any) => (
                  <option key={model.modelId} value={model.modelId}>
                    {model.name}
                  </option>
                ))}
              </select> 
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Año</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Color</label>
            {colorsLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="colorId"
                value={formData.colorId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione un color</option>
                {colors?.map((color: any) => (
                  <option key={color.colorId} value={color.colorId}>
                    {color.name}
                  </option>
                ))}
              </select>
            )}
          </div>               
        
          <div>
            <label className="block text-gray-700 font-semibold">Kilometraje</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>          
          
          <div>
            <label className="block text-gray-700 font-semibold">Precio (MXN)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Número de Stock</label>
            <input
              type="text"
              name="stockNumber"
              value={formData.stockNumber}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Condicion</label>
            {vehicleConditionsLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="conditionId"
                value={formData.conditionId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione una Condicion</option>
                {vehicleConditions?.map((vehicleCondition: any) => (
                  <option key={vehicleCondition.conditionId} value={vehicleCondition.conditionId}>
                    {vehicleCondition.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Disponibilidad</label>
            {vehicleAvailabilityStatusesLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="availabilityStatusId"
                value={formData.availabilityStatusId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione Disponilidad</option>
                {vehicleAvailabilityStatuses?.map((vehicleAvailabilityStatus: any) => (
                  <option key={vehicleAvailabilityStatus.statusId} value={vehicleAvailabilityStatus.statusId}>
                    {vehicleAvailabilityStatus.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Ubicacion</label>
            {locationsLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="locationId"
                value={formData.locationId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione Ubicacion</option>
                {locations?.map((location: any) => (
                  <option key={location.locationId} value={location.locationId}>
                    {location.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Garantía de Vehículo</label>
            {warrantiesLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="warrantyId"
                value={formData.warrantyId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione Garantía de Vehículo</option>
                {warranties?.map((warranty: any) => (
                  <option key={warranty.warrantyId} value={warranty.warrantyId}>
                    {warranty.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Garantía de Batería</label>
            {batteryWarrantiesLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="batteryWarrantyId"
                value={formData.batteryWarrantyId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione Garantía de Batería</option>
                {batteryWarranties?.map((batteryWarranty: any) => (
                  <option key={batteryWarranty.batteryWarrantyId} value={batteryWarranty.batteryWarrantyId}>
                    {batteryWarranty.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Estatus</label>
            {vehicleStatusesLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="statusId"
                value={formData.statusId}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="">Seleccione un Estatus</option>
                {vehicleStatuses?.map((vehicleStatus: any) => (
                  <option key={vehicleStatus.statusId} value={vehicleStatus.statusId}>
                    {vehicleStatus.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              rows={4}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Guardar Vehículo
          </button>
          <button 
            type="button" 
            onClick={handleBack} 
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Regresar a Vehículos
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditVehicle;
