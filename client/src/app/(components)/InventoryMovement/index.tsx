import { useState, useEffect, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import {
  useGetLocationsQuery,
  useGetVehiclesByLocationIdQuery,
  useGetProductsByLocationIdQuery,
  useCreateMovementMutation,
  useGetRolePermissionsByModuleQuery,
  PermissionPage
} from '@/state/api';
import Header from '@/app/(components)/Header';
import { Product, Location, Vehicle, User } from '@/state/api';
import VehicleModal from '@/app/(components)/VehicleModal';
import ProductModal from '../ProductModal';

interface InventoryMovementProps {  
  currentUserDetails: User
};

type MovementFormData = {
    fromLocationId: string;
    toLocationId: string;
    quantity?: number;
    movementType: string;
    movementDate: string;
    status: string;
    notes?: string;
    orderReference?: string;
  };

const InventoryMovement = ({ currentUserDetails }: InventoryMovementProps) => {
    const router = useRouter();
    const { data: locations = [] } = useGetLocationsQuery();
    const [activeTab, setActiveTab] = useState("vehiculos");
    const [moduleName, setModuleName] = useState("Inventory");
    const [subModuleName, setSubModuleName] = useState("Movimientos");
  
    const userId = currentUserDetails.userId ? currentUserDetails.userId.toString(): '';
    const roleId = currentUserDetails.roleId ? currentUserDetails.roleId.toString(): '';

    const { data: permissionsData, isLoading: permissionsLoading } = useGetRolePermissionsByModuleQuery(
      {
        roleId: roleId || "",  // Si roleId no está disponible, pasamos una cadena vacía o un valor adecuado
        moduleName,
        subModuleName,
      },
      { skip: !roleId }  // Esto evita la consulta cuando no tenemos roleId
    );
  
    const [createMovement] = useCreateMovementMutation();
  
    const [formData, setFormData] = useState<MovementFormData>({
      fromLocationId: '',
      toLocationId: '',
      movementType: 'TRANSFERENCIA',
      movementDate: new Date().toISOString().slice(0, 10),
      status: 'EN TRANSITO',
    });
  
    // Estado para los vehículos seleccionados y disponibles
    
    const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
    const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [productQuantities, setProductQuantities] = useState<{ [productId: number]: number }>({});
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [productModalOpen, setProductModalOpen] = useState(false);
  
    const { data: vehicles } = useGetVehiclesByLocationIdQuery(currentUserDetails.locationId ? currentUserDetails.locationId.toString() : '', {
      skip: !formData.fromLocationId, // Solo se llama si hay un fromLocationId
    });

    const { data: products } = useGetProductsByLocationIdQuery(currentUserDetails.locationId ? currentUserDetails.locationId.toString() : '' );

    const userPermissions = permissionsData?.permissions || [];
  
    useEffect(() => {    
      if (vehicles && vehicles.length > 0) {
        setAvailableVehicles(vehicles);
      } else {
        setAvailableVehicles([]); // Limpia los vehículos si no hay selección
        setSelectedVehicles([]);
      }
    }, [vehicles]);

    useEffect(() => {    
      if (products && products.length > 0) {
        setAvailableProducts(products);
      } else {
        setAvailableProducts([]); // Limpia los vehículos si no hay selección
        setSelectedProducts([]);
      }
    }, [products]);
  
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const handleProductQuantityChange = (productId: number, quantity: number) => {
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: quantity,
      }));
    };
  
    const handleMovementTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target;
      
      setFormData((prevFormData) => ({
        ...prevFormData,
        movementType: value,
        fromLocationId: value === 'ENTRADA' ? '' : prevFormData.fromLocationId,  // Limpia el fromLocationId si es 'Entrada'
        toLocationId: value === 'SALIDA' ? '' : prevFormData.toLocationId,      // Limpia el toLocationId si es 'Salida'
        status: value === 'TRANSFERENCIA' ? 'EN TRANSITO' : 'COMPLETADO',  
      }));
    };
  
    const handleRemoveVehicle = (vehicleId: number) => {
      setSelectedVehicles(selectedVehicles.filter((v) => v.vehicleId !== vehicleId));
    };

    const handleRemoveProduct = (productId: number) => {
      setSelectedProducts(selectedProducts.filter((v) => v.productId !== productId));
    };

    const handleVehicleSelection = (selected: Vehicle[]) => {
      setSelectedVehicles(selected);
    };

    const handleProductSelection = (selected: Product[]) => {
      setSelectedProducts(selected);
    };

    const handleTabChange = (tab: SetStateAction<string>) => {
      setActiveTab(tab);
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      // Prepara los detalles del movimiento para enviarlos
      const vehiclemovementDetails = selectedVehicles.map(vehicle => ({
        vehicleId: vehicle.vehicleId,
        quantity: 1,
        productId: null,  
        inspectionStatus: 'PENDIENTE', // Estado inicial de la inspección
      }));

      const productMovementDetails = selectedProducts.map(product => ({
        productId: product.productId,
        quantity: productQuantities[product.productId] || 0,
        inspectionStatus: 'PENDIENTE', // Estado inicial de la inspección
      }));

      const combinedMovementDetails = [...vehiclemovementDetails, ...productMovementDetails];

      const movementData = {
        fromLocationId: Number(formData.fromLocationId),
        toLocationId: Number(formData.toLocationId),
        quantity: selectedVehicles.length,
        movementType: formData.movementType, 
        movementDate: formData.movementDate,
        status: formData.status,
        notes: formData.notes,
        orderReference: formData.orderReference,
        approved: false,
        createdById: userId,
        details: combinedMovementDetails,
      };
    
      try {
  
        const response = await createMovement(movementData);
        router.push('/inventoryMovements');       
      } catch (error) {
        console.error('Error al crear el movimiento:', error);
        // Manejo de errores, por ejemplo, mostrar un mensaje de error
      }
    };

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
      <div className="mx-auto py-5 w-full">
        <Header name="Registrar Movimiento de Inventario" />
  
        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-2 gap-6">
  
        <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Orden de Movimiento</label>
            <input
              type="text"
              name="orderReference"
              value={formData.orderReference}
              onChange={handleChange}            
              className="border border-gray-300 rounded p-2"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Fecha del Movimiento</label>
            <input
              type="date"
              name="movementDate"
              value={formData.movementDate}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Tipo de Movimiento</label>
            <select
              name="movementType"
              value={formData.movementType}
              onChange={handleMovementTypeChange }
              className="border border-gray-300 rounded p-2"
            >
              <option value="ENTRADA">ENTRADA</option>
              <option value="SALIDA">SALIDA</option>
              <option value="TRANSFERENCIA">TRANSFERENCIA</option>
            </select>
          </div>
  
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Estado del Movimiento</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2"
            >
              <option value="EN TRANSITO">EN TRANSITO</option>
              <option value="COMPLETADO">COMPLETADO</option>
            </select>
          </div>
          
          {/* From Location */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Ubicación de Origen</label>
            <select
              name="fromLocationId"
              value={formData.fromLocationId}
              onChange={handleChange}
              disabled={formData.movementType === 'ENTRADA'} 
              className="border border-gray-300 rounded p-2"
            >
              <option value="">Seleccionar ubicación</option>
              {locations
              .filter((location: Location) => Number(location.locationId) === currentUserDetails.locationId)
              .map((location: Location) => (
                <option key={location.locationId} value={location.locationId}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
  
          {/* To Location */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Ubicación de Destino</label>
            <select
              name="toLocationId"
              value={formData.toLocationId}
              onChange={handleChange}
              disabled={formData.movementType === 'SALIDA'} 
              className="border border-gray-300 rounded p-2"
            >
              <option value="">Seleccionar ubicación</option>
              {locations
                .filter((location: Location) => {
                  // Si es ENTRADA, solo muestra la ubicación actual del usuario
                  if (formData.movementType === 'ENTRADA') {
                    return Number(location.locationId) === currentUserDetails.locationId;
                  }
                  // Si es otro tipo, excluye la ubicación del usuario
                  return Number(location.locationId) !== currentUserDetails.locationId;
                })
                .map((location: Location) => (
                  <option key={location.locationId} value={location.locationId}>
                    {location.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Tabs */}
          <div className="col-span-2">
            <div className="flex border-b border-gray-300 mb-4">
              <button
                type="button"
                onClick={() => handleTabChange("vehiculos")}
                className={`py-2 px-4 ${activeTab === "vehiculos" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
              >
                Vehículos
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("productos")}
                className={`py-2 px-4 ${activeTab === "productos" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
              >
                Productos
              </button>
          </div>

          {/* Content for Vehículos Tab */}
          {activeTab === "vehiculos" && (
            <div>
              <div className="col-span-2">
                {permissions.canAdd && ( 
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  Agregar Vehículos
                </button>
                )}
              </div>

                {/* Vehículos Seleccionados Grid */}
              <div className="col-span-2 mt-4">
                <label className="text-gray-700 font-medium">Vehículos Seleccionados</label>
                <table className="min-w-full table-auto border-collapse border border-gray-400">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Modelo</th>
                      <th className="border border-gray-300 px-4 py-2">Color</th>
                      <th className="border border-gray-300 px-4 py-2">Serial</th>
                      <th className="border border-gray-300 px-4 py-2">Numero de Motor</th>
                      <th className="border border-gray-300 px-4 py-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVehicles.map((vehicle: Vehicle) => (
                      <tr key={vehicle.vehicleId}>
                        <td className="border border-gray-300 px-4 py-2">{vehicle.model.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{vehicle.color.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{vehicle.internal_serial}</td>
                        <td className="border border-gray-300 px-4 py-2">{vehicle.engineNumber}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveVehicle(vehicle.vehicleId)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>      
            </div>
            )}

            {/* Content for Productos Tab */}
            {activeTab === "productos" && (
              <div>
                <div className="col-span-2">
                  {permissions.canAdd && (
                    <button
                      type="button"
                      onClick={() => setProductModalOpen(true)} // Cambia esto a la lógica que maneja los productos
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                    >
                      Agregar Productos
                    </button>
                  )}
                </div>
  
                {/* Aquí puedes agregar el contenido para los productos seleccionados */}
                <div className="col-span-2 mt-4">
                  <label className="text-gray-700 font-medium">Productos Seleccionados</label>
                  {/* Tabla de productos seleccionados (similar a la de vehículos) */}
                  <table className="min-w-full table-auto border-collapse border border-gray-400">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 px-4 py-2">Codigo</th>
                        <th className="border border-gray-300 px-4 py-2">Nombre</th>
                        <th className="border border-gray-300 px-4 py-2">Cantidad</th>
                        <th className="border border-gray-300 px-4 py-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                    {selectedProducts.map((product: Product) => (
                      <tr key={product.productId}>
                        <td className="border border-gray-300 px-4 py-2">{product.productCode}</td>
                        <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                          <input 
                              type="number"
                              value={productQuantities[product.productId] || 1}
                              min={1}
                              max={
                                formData.movementType === 'ENTRADA' ? undefined : product.stockQuantity
                              }
                              onChange={(e) => handleProductQuantityChange(
                                product.productId,
                                Math.max(1, Number(e.target.value))
                              )}
                              className="border border-gray-300 rounded p-1 w-20"
                              disabled={product.stockQuantity === 0 && formData.movementType !== 'ENTRADA'}
                            />
                        <td className="border border-gray-300 px-4 py-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(product.productId)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
               )}
          </div>

          <div className="flex flex-col col-span-2">
            <label className="text-gray-700 font-medium">Notas</label>
            <textarea
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2"
              placeholder="Agregar notas sobre el movimiento"
            />
          </div>
  
          <div className="flex col-span-2 justify-end mt-4">
          {permissions.canAdd && ( 
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              disabled={selectedVehicles.length < 1 && selectedProducts.length < 1}
            >
              Registrar Movimiento
            </button>
          )}
          </div>
        </form>
  
        <VehicleModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          availableVehicles={availableVehicles}
          selectedVehicles={selectedVehicles}
          onSelect={handleVehicleSelection}
        />
        <ProductModal
          open={productModalOpen}
          onClose={() => setProductModalOpen(false)}
          availableProducts={availableProducts}
          selectedProducts={selectedProducts}
          onSelect={handleProductSelection}
        />
      </div>
    );
};

export default InventoryMovement;
