"use client";

import { useEffect, useState } from "react";
import { 
  useGetVehicleByIdQuery, 
  useGetMakesQuery,
  useGetFamiliesQuery,
  useGetModelsQuery,
  useGetColorsQuery,  
  useGetVehicleStatusesQuery,
  useGetVehicleConditionsQuery,
  useGetVehicleAvailabilityStatusesQuery,
  useGetLocationsQuery,
  useGetWarrantiesQuery,
  useGetBatteryWarrantiesQuery,
} from "@/state/api";
import { useRouter } from 'next/navigation';

const ViewVehicle = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const id = params.id;
  const { data: vehicle, isLoading: vehicleLoading } = useGetVehicleByIdQuery(id);

  const [selectedMakeId, setSelectedMakeId] = useState<number | null>(null);
  const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);

  const { data: makes = [], isLoading: makesLoading } = useGetMakesQuery();  
  const { data: families = [], isLoading: familiesLoading } = useGetFamiliesQuery({
    makeId: selectedMakeId ?? undefined,  
  });
  const { data: models = [], isLoading: modelsLoading } = useGetModelsQuery({
    familyId: selectedFamilyId ?? undefined, 
  });
  const { data: colors, isLoading: colorsLoading } = useGetColorsQuery();
  const { data: vehicleStatuses, isLoading: vehicleStatusesLoading } = useGetVehicleStatusesQuery();
  const { data: vehicleConditions, isLoading: vehicleConditionsLoading } = useGetVehicleConditionsQuery();
  const { data: vehicleAvailabilityStatuses, isLoading: vehicleAvailabilityStatusesLoading } = useGetVehicleAvailabilityStatusesQuery();   
  const { data: warranties, isLoading: warrantiesLoading } = useGetWarrantiesQuery(); 
  const { data: batteryWarranties, isLoading: batteryWarrantiesLoading } = useGetBatteryWarrantiesQuery(); 
  const { data: locations, isLoading: locationsLoading } = useGetLocationsQuery();

  const [formData, setFormData] = useState({
    vin: "",
    internal_serial: "",    
    makeId: 0,
    familyId: 0,
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
    engineNumber: "",
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vin: vehicle.vin!,
        internal_serial: vehicle.internal_serial!,
        makeId: vehicle.makeId,
        familyId: vehicle.familyId,
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
        engineNumber: vehicle.engineNumber!,
      });
      setSelectedMakeId(vehicle.makeId);
      setSelectedFamilyId(vehicle.familyId);
      setSelectedModelId(vehicle.modelId);
    }
  }, [vehicle]);

  if (vehicleLoading) {
    return <p>Cargando vehículo...</p>;
  }

  const handleBack = () => {
    router.push("/vehicles");
  };

  return (
    <div className="mx-auto p-6 max-w-6xl bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Detalles del Vehículo</h2>
      
      <form>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          {/* Campos en solo lectura */}
          <div>
            <label className="block text-gray-700 font-semibold">Número de Serie Interno</label>
            <input
              type="text"
              name="internal_serial"
              value={formData.internal_serial}
              readOnly
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>
         
          <div>
            <label className="block text-gray-700 font-semibold">Fabricante</label>
            <select
              name="makeId"
              value={formData.makeId}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            >
              <option value="">Seleccione un fabricante</option>
              {makes?.map((make: any) => (
                <option key={make.makeId} value={make.makeId}>
                  {make.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Familia</label>
            {familiesLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="familyId"
                value={formData.familyId}
                disabled
                className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
              >
                <option value="">Seleccione un fabricante</option>
                {families?.map((make: any) => (
                  <option key={make.familyId} value={make.familyId}>
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
                disabled
                className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
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
            <label className="block text-gray-700 font-semibold">Número de Motor</label>
            <input
              type="text"
              name="engineNumber"
              value={formData.engineNumber}
              readOnly
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">VIN</label>
            <input
              type="text"
              name="vin"
              value={formData.vin}
              readOnly
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Año</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              readOnly
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
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
                disabled
                className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
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
              readOnly
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Precio (MXN)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              readOnly
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Número de Stock</label>
            <input
              type="text"
              name="stockNumber"
              value={formData.stockNumber}
              readOnly
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Condición</label>
            {vehicleConditionsLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="conditionId"
                value={formData.conditionId}
                disabled
                className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
              >
                <option value="">Seleccione una Condición</option>
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
                disabled
                className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
              >
                <option value="">Seleccione Disponibilidad</option>
                {vehicleAvailabilityStatuses?.map((vehicleAvailabilityStatus: any) => (
                  <option key={vehicleAvailabilityStatus.statusId} value={vehicleAvailabilityStatus.statusId}>
                    {vehicleAvailabilityStatus.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Ubicación</label>
            {locationsLoading ? (
              <p>Cargando...</p>
            ) : (
              <select
                name="locationId"
                value={formData.locationId}
                disabled
                className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
              >
                <option value="">Seleccione Ubicación</option>
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
            <select
              name="warrantyId"
              value={formData.warrantyId}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            >
              <option value="">Seleccione Garantía de Vehículo</option>
              {warranties?.map((warranty: any) => (
                <option key={warranty.warrantyId} value={warranty.warrantyId}>
                  {warranty.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Garantía de Batería</label>
            <select
              name="batteryWarrantyId"
              value={formData.batteryWarrantyId}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            >
              <option value="">Seleccione Garantía de Batería</option>
              {batteryWarranties?.map((batteryWarranty: any) => (
                <option key={batteryWarranty.batteryWarrantyId} value={batteryWarranty.batteryWarrantyId}>
                  {batteryWarranty.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Estatus</label>
            <select
              name="statusId"
              value={formData.statusId}
              disabled
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
            >
              <option value="">Seleccione un Estatus</option>
              {vehicleStatuses?.map((vehicleStatus: any) => (
                <option key={vehicleStatus.statusId} value={vehicleStatus.statusId}>
                  {vehicleStatus.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              readOnly
              className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100"
              rows={4}
            ></textarea>
          </div>


        </div>

        <button type="button" onClick={handleBack} className="mt-6 bg-blue-500 text-white px-4 py-2 rounded">
          Volver
        </button>
      </form>
    </div>
  );
};

export default ViewVehicle;
