"use client";

import { useState, useEffect } from "react";
import {
  useGetAuthUserQuery,
  useGetRolePermissionsByModuleQuery,
  useGetModelsQuery,
  useCreateModelMutation,
  useUpdateModelMutation,
  useDeleteModelMutation,
  useGetMakesQuery,
  useGetFamiliesQuery,
  useGetVehicleTypesQuery,
  useGetEngineTypesQuery,
  useGetFuelTypesQuery,
  useGetTransmissionsQuery,
  NewModel,
  UpdatedModel,
  PermissionPage,
} from "@/state/api";
import { PlusCircleIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import Image from "next/image";
import CreateModelModal from "./CreateModelModal";
import EditModelModal from "./EditModelModal";
import { Model } from "@/state/api";

const Models = () => {
  const { data: currentUser } = useGetAuthUserQuery({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMakeId, setSelectedMakeId] = useState<number | null>(null);
  const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [roleId, setRoleId] = useState<string | undefined>(undefined);
  const [moduleName, setModuleName] = useState("Inventory");
  const [subModuleName, setSubModuleName] = useState("Modelos");

  useEffect(() => {
    if (currentUser?.userDetails?.roleId) {
      setRoleId(currentUser.userDetails.roleId.toString());
    }
  }, [currentUser]);

  const { data: permissionsData, isLoading: permissionsLoading } = useGetRolePermissionsByModuleQuery(
    {
      roleId: roleId || "",  // Si roleId no está disponible, pasamos una cadena vacía o un valor adecuado
      moduleName,
      subModuleName,
    },
    { skip: !roleId }  // Esto evita la consulta cuando no tenemos roleId
  );

  const { data: makes = [] } = useGetMakesQuery();
  const { data: families = [] } = useGetFamiliesQuery({
    makeId: selectedMakeId ?? 1, // Cambia a undefined si es null
  });
  const { data: vehicleTypes = [] } = useGetVehicleTypesQuery();
  const { data: engineTypes = [] } = useGetEngineTypesQuery();
  const { data: fuelTypes = [] } = useGetFuelTypesQuery();
  const { data: transmissions = [] } = useGetTransmissionsQuery();

  const { data: models, isLoading, isError } = useGetModelsQuery({
    search: searchTerm,
    familyId: selectedFamilyId ?? 1,
  });

  const userPermissions = permissionsData?.permissions || [];

  const [createModel] = useCreateModelMutation();
  const [updateModel] = useUpdateModelMutation();
  const [deleteModel] = useDeleteModelMutation();

  const handleCreateModel = async (newModelData: Model) => {
    try {

      const modelData = {
        ...newModelData,
        makeId: newModelData.makeId, // makeId is already number type
        familyId: newModelData.familyId, // familyId is already number type
        vehicleTypeId: newModelData.vehicleTypeId,
        engineTypeId: newModelData.engineTypeId,
        transmissionId: newModelData.transmissionId,
        fuelTypeId: newModelData.fuelTypeId,
        batteryCapacity: newModelData.batteryCapacity
          ? parseFloat(newModelData.batteryCapacity.toString())
          : 0,
        range: newModelData.range
          ? parseFloat(newModelData.range.toString())
          : 0,
        basePrice: parseFloat(newModelData.basePrice.toString()),
        chargeTime: parseFloat(newModelData.chargeTime.toString()),             
        speed: parseFloat(newModelData.speed.toString()),
        weightCapacity: parseFloat(newModelData.weightCapacity.toString()),
        motorWattage: parseFloat((newModelData.motorWattage || 0).toString()),
        wheelCount: parseFloat(newModelData.wheelCount.toString()),
        batteryVoltage: parseFloat(newModelData.batteryVoltage.toString()),
      };

      await createModel(modelData).unwrap();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create model:", error);
    }
  };

  const handleEditModel = async (modelId: string, updatedData: Partial<Model>) => {
    if (modelId) {
      try {

        const modelData = {
          ...updatedData,
          makeId: updatedData.makeId ?? 0, // Asegurarse de que tenga un valor numérico
        familyId: updatedData.familyId ?? 0,
        vehicleTypeId: updatedData.vehicleTypeId ?? 0,
        engineTypeId: updatedData.engineTypeId ?? 0,
        transmissionId: updatedData.transmissionId ?? 0,
        fuelTypeId: updatedData.fuelTypeId ?? 0,
        batteryCapacity: updatedData.batteryCapacity
          ? parseFloat(updatedData.batteryCapacity.toString())
          : 0,
        range: updatedData.range
          ? parseFloat(updatedData.range.toString())
          : 0,
        basePrice: updatedData.basePrice
          ? parseFloat(updatedData.basePrice.toString())
          : 0,
        chargeTime: updatedData.chargeTime
          ? parseFloat(updatedData.chargeTime.toString())
          : 0,
        speed: updatedData.speed
          ? parseFloat(updatedData.speed.toString())
          : 0,
        weightCapacity: updatedData.weightCapacity
          ? parseFloat(updatedData.weightCapacity.toString())
          : 0,
        motorWattage: parseFloat((updatedData.motorWattage || 0).toString()),
        wheelCount: updatedData.wheelCount
          ? parseFloat(updatedData.wheelCount.toString())
          : 0,
        batteryVoltage: updatedData.batteryVoltage
          ? parseFloat(updatedData.batteryVoltage.toString())
          : 0,
        };
           
        await updateModel({ id: modelId, data: modelData });   
        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Failed to update model:", error);
      }
    } 
  };

  const handleDeleteModel = async (modelId: string) => {
    if (modelId) {
      try {
        await deleteModel(modelId).unwrap();
      } catch (error) {
        console.error("Failed to delete model:", error);
      }
    }
  };

  const handleMakeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const makeId = Number(event.target.value);
    setSelectedMakeId(makeId);
    setSelectedFamilyId(null); // Reset family selection when make changes
  };

  const handleFamilyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const familyId = Number(event.target.value);
    setSelectedFamilyId(familyId);
  };

  useEffect(() => {
    if (makes.length > 0) {
      // Set the first make as default
      setSelectedMakeId(Number(makes[0].makeId));
    }
  }, [makes]);

  useEffect(() => {
    if (families.length > 0) {
      // Set the first family as default based on the selected make
      setSelectedFamilyId(Number(families[0].familyId));
    }
  }, [families]);

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !models) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch models
      </div>
    );
  }

  const transformPermissions = (userPermissions: string[]): PermissionPage => {
    return {     
      canAccess: userPermissions.includes("ACCESS"),
      canAdd: userPermissions.includes("ADD"),    
      canEdit: userPermissions.includes("EDIT"),    
      canDelete: userPermissions.includes("DELETE"),    
      canImport: userPermissions.includes("IMPORT"),    
      canExport: userPermissions.includes("EXPORT"),    
      canViewDetail: userPermissions.includes("VIEW_DETAIL"),    
    };
  };

  const permissions = transformPermissions(userPermissions);
 
  return (
    <div className="mx-auto pb-5 w-full">
  {/* HEADER BAR */}
  <div className="flex justify-between items-center mb-6">
    <Header name="Modelos" />
    {permissions.canAdd && (
            <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Crear Modelo
          </button>
          )}        
  </div>

  {/* FILTERS CONTAINER */}
  <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* MAKE SELECT */}
    <div className="flex flex-col">
      <label htmlFor="makeSelect" className="mb-1 font-semibold text-gray-700">Fabricante</label>
      <select
        id="makeSelect"
        value={selectedMakeId || ""}
        onChange={handleMakeChange}
        className="border-2 border-gray-300 rounded py-2 px-4"
      >
        {makes.map((make) => (
          <option key={make.makeId} value={make.makeId}>
            {make.name}
          </option>
        ))}
      </select>
    </div>

    {/* FAMILY SELECT */}    
    <div className="flex flex-col">
      <label htmlFor="familySelect" className="mb-1 font-semibold text-gray-700">Familia</label>
      <select
        id="familySelect"
        value={selectedFamilyId || ""} // Permitir un valor vacío para "Todas"
        onChange={handleFamilyChange}
        className="border-2 border-gray-300 rounded py-2 px-4"
        disabled={!selectedMakeId} // Disable if no make is selected
      >
        {/* Opción de "Todas" */}
        <option value="">Todas</option> 
        {families.map((family) => (
          <option key={family.familyId} value={family.familyId}>
            {family.name}
          </option>
        ))}
      </select>
    </div>

  </div>

  {/* SEARCH BAR */}
  <div className="mb-6">
    <div className="flex items-center border-2 border-gray-200 rounded">
      <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
      <input
        className="w-full py-2 px-4 rounded bg-white"
        placeholder="Buscar modelos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  </div>

  {/* BODY MODELS LIST */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
  {models.map((model) => (
    <div
      key={model.modelId}
      className="border shadow rounded-md p-4 max-w-full w-full mx-auto flex"
    >
      {/* Imagen en el lado izquierdo, tamaño grande */}
      <div className="flex-shrink-0 w-1/2">
        <Image
          src={model.mainImageUrl || "/path/to/default-image.jpg"}  // Imagen por defecto
          alt={model.name}
          layout="responsive"
          width={500}
          height={500}
          className="rounded-2xl object-cover"
        />
      </div>

      {/* Texto en el lado derecho */}
      <div className="ml-6 flex flex-col justify-center w-1/2">
        <h3 className="text-2xl text-gray-900 font-semibold">{model.name}</h3>

        {model.make?.name && (
          <p className="text-gray-600 mt-2">Fabricante: {model.make.name}</p>
        )}
        {model.family?.name && (
          <p className="text-gray-600">Familia: {model.family.name}</p>
        )}
        {model.year_start && (
          <p className="text-gray-600">Año Inicio: {model.year_start}</p>
        )}
        {model.year_end && (
          <p className="text-gray-600">Año Fin: {model.year_end}</p>
        )}
        {model.vehicleType?.name && (
          <p className="text-gray-600">Tipo de Vehículo: {model.vehicleType.name}</p>
        )}
        {model.engineType?.name && (
          <p className="text-gray-600">Motor: {model.engineType.name}</p>
        )}
        {model.transmission?.type && (
          <p className="text-gray-600">Transmisión: {model.transmission.type}</p>
        )}
        {model.fuelType?.name && (
          <p className="text-gray-600">Tipo de Carga: {model.fuelType.name}</p>
        )}

        {/* Botones en el lado derecho */}
        <div className="flex mt-4 space-x-4">
        {permissions.canEdit && (
            <button
            className="text-blue-500 hover:text-blue-700 flex items-center"
            onClick={() => {
              setSelectedModel(model);
              setIsEditModalOpen(true);
            }}
            >
              <PencilIcon className="w-5 h-5 mr-2" /> Editar
            </button>
          )}     

          {permissions.canEdit && (
             <button
             className="text-red-500 hover:text-red-700 flex items-center"
             onClick={() => handleDeleteModel(model.modelId)}
              >
             <TrashIcon className="w-5 h-5 mr-2" /> Eliminar
           </button>
          )}     
          
        </div>
      </div>
    </div>
  ))}
</div>


  {/* MODALS */}
  <CreateModelModal
    isOpen={isCreateModalOpen}
    onClose={() => setIsCreateModalOpen(false)}
    onCreate={handleCreateModel}    
    vehicleTypes={vehicleTypes}
    engineTypes={engineTypes}
    fuelTypes={fuelTypes}
    transmissions={transmissions}
  />
  <EditModelModal
    isOpen={isEditModalOpen}
    onClose={() => setIsEditModalOpen(false)}
    vehicleTypes={vehicleTypes}
    engineTypes={engineTypes}
    fuelTypes={fuelTypes}
    transmissions={transmissions}
    onEdit={handleEditModel}
    selectedModel={selectedModel}
  />
</div>

  
  );
};

export default Models;
