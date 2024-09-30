import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
  productId: string;
  name: string;
  description?: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  categoryId: string;
  manufacturerId: string;
  mainImageUrl?: string;
  additionalImages?: string[];
}

export interface NewProduct {
  name: string;
  description?: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  categoryId: string;
  manufacturerId: string;
  mainImageUrl?: string;
  additionalImages?: string[];
}

export interface UpdatedProduct {
  name?: string;
  description?: string;
  price?: number;
  rating?: number;
  stockQuantity?: number;
  categoryId?: string;
  manufacturerId?: string;
  mainImageUrl?: string;
  additionalImages?: string[];
}

/* ADDITIONAL INTERFACES */

export interface VehicleType {
  vehicleTypeId: string;
  name: string;
}

export interface NewVehicleType {
  name: string;
}

export interface UpdatedVehicleType {
  name?: string;
}

export interface Make {
  makeId: string;
  name: string;
  country?: string;
  website?: string;
  phone?: string;
  mail?: string;
}

export interface NewMake {
  name: string;
  country?: string;
  website?: string;
  phone?: string;
  mail?: string;
}

export interface UpdatedMake {
  name?: string;
  country?: string;
  website?: string;
  phone?: string;
  mail?: string;
}

export interface Model {
  modelId: string;
  name: string;
  makeId: string;
  make?: {
    name: string; 
  };
  year_start?: string;
  year_end?: string;
  type?: string;
  battery_capacity?: number;
  electric_range?: number;
}

export interface NewModel {
  name: string;
  makeId: number;               
  year_start?: string;
  year_end?: string;
  type?: string;
  battery_capacity?: number;
  electric_range?: number;
}

export interface UpdatedModel {
  name?: string;
  makeId?: string;
  year_start?: string;
  year_end?: string;
  type?: string;
  battery_capacity?: number;
  electric_range?: number;
}

export interface Color {
  colorId: string;
  name: string;
}

export interface NewColor {
  name: string;
}

export interface UpdatedColor {
  name?: string;
}

export interface EngineType {
  engineTypeId: string;
  name: string;
  description?: string;
}

export interface NewEngineType {
  name: string;
  description?: string;
}

export interface UpdatedEngineType {
  name?: string;
  description?: string;
}

export interface FuelType {
  fuelTypeId: string;
  name: string;
}

export interface NewFuelType {
  name: string;
}

export interface UpdatedFuelType {
  name?: string;
}

export interface Transmission {
  transmissionId: string;
  type: string;
}

export interface NewTransmission {
  type: string;
}

export interface UpdatedTransmission {
  type?: string;
}

export interface VehicleStatus {
  statusId: string;
  name: string;
}

export interface NewVehicleStatus {
  name: string;
}

export interface UpdatedVehicleStatus {
  name?: string;
}

export interface Vehicle {
  vehicleId: string;
  vin?: string;
  internal_serial?: string;
  vehicleTypeId: string;
  makeId: string;
  makeName: string;
  modelId: string;
  modelName: string;
  make: { name: string } | null; // Asegúrate de que puede ser nulo
  model: { name: string };
  year: number;
  colorId: string;
  engineTypeId: string;
  fuelTypeId?: string;
  transmissionId: string;
  mileage: number;
  batteryCapacity?: number;
  range?: number;
  wheelCount: number;
  price: number;
  statusId: string;
  stockNumber: string;
  barcode?: string;
  qrCode?: string;
  description?: string;
  mainImageUrl?: string;
  additionalImages?: string[];
  lastAuditDate?: string;
}

export interface NewVehicle {
  vin?: string;
  internal_serial?: string;
  vehicleTypeId: number;
  makeId: number;
  modelId: number;
  year: number;
  colorId: number;
  engineTypeId: number;
  fuelTypeId?: number;
  transmissionId: number;
  statusId: number;
  mileage: number;
  batteryCapacity?: number;
  range?: number;
  wheelCount: number;
  price: number;
  stockNumber: string;
  barcode?: string;
  qrCode?: string;
  description?: string;
  mainImageUrl?: string;
  additionalImages?: string[];
  lastAuditDate?: string;
}

export interface UpdatedVehicle {
  vin?: string;
  internal_serial?: string;
  vehicleTypeId?: string;
  makeId?: string;
  modelId?: string;
  year?: number;
  colorId?: string;
  engineTypeId?: string;
  fuelTypeId?: string;
  transmissionId?: string;
  mileage?: number;
  batteryCapacity?: number;
  range?: number;
  wheelCount?: number;
  price?: number;
  statusId?: string;
  stockNumber?: string;
  barcode?: string;
  qrCode?: string;
  description?: string;
  mainImageUrl?: string;
  additionalImages?: string[];
  lastAuditDate?: string;
}

export interface SalesSummary {
  salesSummaryId: string;
  totalValue: number;
  changePercentage?: number;
  date: string;
}

export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number;
  changePercentage?: number;
  date: string;
}

export interface ExpenseSummary {
  expenseSummarId: string;
  totalExpenses: number;
  date: string;
}

export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}

export interface DashboardMetrics {
  popularProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

export interface User {
  userId: string;
  name: string;
  email: string;
}

export interface Manufacturer {
  manufacturer_id: string;
  name: string;
  country: string;
  contact_info?: string;
}

export interface NewManufacturer {
  name: string;
  country: string;
  contact_info?: string;
}

export interface UpdatedManufacturer {
  name?: string;
  country?: string;
  contact_info?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface NewCustomer {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface UpdatedCustomer {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface Supplier {
  supplierId: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  email: string;
  phone: string;
}

export interface NewSupplier {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  email: string;
  phone: string;
}

export interface UpdatedSupplier {
  name?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  state?: string;
  country?: string;
  email?: string;
  phone?: string;
}

export interface Category {
  categoryId : string;
  name: string;
  description: string;  
}

export interface NewCategory {
  name: string;
  description: string;
}

export interface UpdatedCategory {
  name?: string;
  description?: string;
}

export interface Location {
  location_id: string;
  name: string;
  type: string;  
  address?: string;
  postal_code?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface NewLocation {
  name: string;
  type: string;  
  address?: string;
  postal_code?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdatedLocation {
  name?: string;
  type: string;  
  address?: string;
  postal_code?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Products", "Users", "Expenses","Manufacturers","Customers","Suppliers","Categories","Locations",
    "VehicleTypes",
    "Makes",
    "Models",
    "Colors",
    "EngineTypes",
    "FuelTypes",
    "Transmissions",
    "VehicleStatus",
    "Vehicles",
  ],
  endpoints: (build) => ({
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
      providesTags: ["Products"],
    }),
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: build.mutation<Product, { id: string; data: UpdatedProduct }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    getUsers: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    getExpensesByCategory: build.query<ExpenseByCategorySummary[], void>({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),
    getManufacturers: build.query<Manufacturer[], string | void>({
      query: (search) => ({
        url: "/manufacturers",
        params: search ? { search } : {},
      }),
      providesTags: ["Manufacturers"],
    }),
    createManufacturer: build.mutation<Manufacturer, NewManufacturer>({
      query: (newManufacturer) => ({
        url: "/manufacturers",
        method: "POST",
        body: newManufacturer,
      }),
      invalidatesTags: ["Manufacturers"],
    }),
    updateManufacturer: build.mutation<Manufacturer, { id: string; data: UpdatedManufacturer }>({
      query: ({ id, data }) => ({
        url: `/manufacturers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Manufacturers"],
    }),
    deleteManufacturer: build.mutation<void, string>({
      query: (id) => ({
        url: `/manufacturers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Manufacturers"],
    }),
    getCustomers: build.query<Customer[], string | void>({
      query: (search) => ({
        url: "/customers",
        params: search ? { search } : {},
      }),
      providesTags: ["Customers"],
    }),
    createCustomer: build.mutation<Customer, NewCustomer>({
      query: (newCustomer) => ({
        url: "/customers",
        method: "POST",
        body: newCustomer,
      }),
      invalidatesTags: ["Customers"],
    }),
    updateCustomer: build.mutation<Customer, { id: string; data: UpdatedCustomer }>({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Customers"],
    }),
    deleteCustomer: build.mutation<void, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers"],
    }),
    getSuppliers: build.query<Supplier[], string | void>({
      query: (search) => ({
        url: "/suppliers",
        params: search ? { search } : {},
      }),
      providesTags: ["Suppliers"],
    }),
    createSupplier: build.mutation<Supplier, NewSupplier>({
      query: (newSupplier) => ({
        url: "/suppliers",
        method: "POST",
        body: newSupplier,
      }),
      invalidatesTags: ["Suppliers"],
    }),
    updateSupplier: build.mutation<Supplier, { id: string; data: UpdatedSupplier }>({
      query: ({ id, data }) => ({
        url: `/suppliers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Suppliers"],
    }),
    deleteSupplier: build.mutation<void, string>({
      query: (id) => ({
        url: `/suppliers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Suppliers"],
    }),  
    getCategories: build.query<Category[], string | void>({
      query: (search) => ({
        url: "/categories",
        params: search ? { search } : {},
      }),
      providesTags: ["Categories"],
    }),    
    createCategory: build.mutation<Category, NewCategory>({
      query: (newCategory) => ({
        url: "/categories",
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: build.mutation<Category, { id: string; data: UpdatedCategory }>({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: build.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),  
    getLocations: build.query<Location[], string | void>({
      query: (search) => ({
        url: "/locations",
        params: search ? { search } : {},
      }),
      providesTags: ["Locations"],
    }),    
    createLocation: build.mutation<Location, NewLocation>({
      query: (newLocation) => ({
        url: "/locations",
        method: "POST",
        body: newLocation,
      }),
      invalidatesTags: ["Locations"],
    }),
    updateLocation: build.mutation<Location, { id: string; data: UpdatedLocation }>({
      query: ({ id, data }) => ({
        url: `/locations/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Locations"],
    }),
    deleteLocation: build.mutation<void, string>({
      query: (id) => ({
        url: `/locations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Locations"],
    }), 
    getVehicleTypes: build.query<VehicleType[], string | void>({
      query: (search) => ({
        url: "/vehicle-types",
        params: search ? { search } : {},
      }),
      providesTags: ["VehicleTypes"],
    }),
    createVehicleType: build.mutation<VehicleType, NewVehicleType>({
      query: (newVehicleType) => ({
        url: "/vehicle-types",
        method: "POST",
        body: newVehicleType,
      }),
      invalidatesTags: ["VehicleTypes"],
    }),
    updateVehicleType: build.mutation<VehicleType, { id: string; data: UpdatedVehicleType }>({
      query: ({ id, data }) => ({
        url: `/vehicle-types/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["VehicleTypes"],
    }),
    deleteVehicleType: build.mutation<void, string>({
      query: (id) => ({
        url: `/vehicle-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["VehicleTypes"],
    }),

    // Makes
    getMakes: build.query<Make[], string | void>({
      query: (search) => ({
        url: "/makes",
        params: search ? { search } : {},
      }),
      providesTags: ["Makes"],
    }),
    createMake: build.mutation<Make, NewMake>({
      query: (newMake) => ({
        url: "/makes",
        method: "POST",
        body: newMake,
      }),
      invalidatesTags: ["Makes"],
    }),
    updateMake: build.mutation<Make, { id: string; data: UpdatedMake }>({
      query: ({ id, data }) => ({
        url: `/makes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Makes"],
    }),
    deleteMake: build.mutation<void, string>({
      query: (id) => ({
        url: `/makes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Makes"],
    }),

    // Models
    getModels: build.query<Model[], string | void>({
      query: (search) => ({
        url: "/models",
        params: search ? { search } : {},
      }),
      providesTags: ["Models"],
    }),
    createModel: build.mutation<Model, NewModel>({
      query: (newModel) => ({
        url: "/models",
        method: "POST",
        body: newModel,
      }),
      invalidatesTags: ["Models"],
    }),
    updateModel: build.mutation<Model, { id: string; data: UpdatedModel }>({
      query: ({ id, data }) => ({
        url: `/models/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Models"],
    }),
    deleteModel: build.mutation<void, string>({
      query: (id) => ({
        url: `/models/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Models"],
    }),

    // Colors
    getColors: build.query<Color[], string | void>({
      query: (search) => ({
        url: "/colors",
        params: search ? { search } : {},
      }),
      providesTags: ["Colors"],
    }),
    createColor: build.mutation<Color, NewColor>({
      query: (newColor) => ({
        url: "/colors",
        method: "POST",
        body: newColor,
      }),
      invalidatesTags: ["Colors"],
    }),
    updateColor: build.mutation<Color, { id: string; data: UpdatedColor }>({
      query: ({ id, data }) => ({
        url: `/colors/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Colors"],
    }),
    deleteColor: build.mutation<void, string>({
      query: (id) => ({
        url: `/colors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Colors"],
    }),

    // Engine Types
    getEngineTypes: build.query<EngineType[], string | void>({
      query: (search) => ({
        url: "/engine-types",
        params: search ? { search } : {},
      }),
      providesTags: ["EngineTypes"],
    }),
    createEngineType: build.mutation<EngineType, NewEngineType>({
      query: (newEngineType) => ({
        url: "/engine-types",
        method: "POST",
        body: newEngineType,
      }),
      invalidatesTags: ["EngineTypes"],
    }),
    updateEngineType: build.mutation<EngineType, { id: string; data: UpdatedEngineType }>({
      query: ({ id, data }) => ({
        url: `/engine-types/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["EngineTypes"],
    }),
    deleteEngineType: build.mutation<void, string>({
      query: (id) => ({
        url: `/engine-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EngineTypes"],
    }),

    // Fuel Types
    getFuelTypes: build.query<FuelType[], string | void>({
      query: (search) => ({
        url: "/fuel-types",
        params: search ? { search } : {},
      }),
      providesTags: ["FuelTypes"],
    }),
    createFuelType: build.mutation<FuelType, NewFuelType>({
      query: (newFuelType) => ({
        url: "/fuel-types",
        method: "POST",
        body: newFuelType,
      }),
      invalidatesTags: ["FuelTypes"],
    }),
    updateFuelType: build.mutation<FuelType, { id: string; data: UpdatedFuelType }>({
      query: ({ id, data }) => ({
        url: `/fuel-types/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["FuelTypes"],
    }),
    deleteFuelType: build.mutation<void, string>({
      query: (id) => ({
        url: `/fuel-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FuelTypes"],
    }),

    // Transmissions
    getTransmissions: build.query<Transmission[], string | void>({
      query: (search) => ({
        url: "/transmissions",
        params: search ? { search } : {},
      }),
      providesTags: ["Transmissions"],
    }),
    createTransmission: build.mutation<Transmission, NewTransmission>({
      query: (newTransmission) => ({
        url: "/transmissions",
        method: "POST",
        body: newTransmission,
      }),
      invalidatesTags: ["Transmissions"],
    }),
    updateTransmission: build.mutation<Transmission, { id: string; data: UpdatedTransmission }>({
      query: ({ id, data }) => ({
        url: `/transmissions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Transmissions"],
    }),
    deleteTransmission: build.mutation<void, string>({
      query: (id) => ({
        url: `/transmissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transmissions"],
    }),

    // Vehicle Status
    getVehicleStatuses: build.query<VehicleStatus[], string | void>({
      query: (search) => ({
        url: "/vehicle-status",
        params: search ? { search } : {},
      }),
      providesTags: ["VehicleStatus"],
    }),
    createVehicleStatus: build.mutation<VehicleStatus, NewVehicleStatus>({
      query: (newVehicleStatus) => ({
        url: "/vehicle-status",
        method: "POST",
        body: newVehicleStatus,
      }),
      invalidatesTags: ["VehicleStatus"],
    }),
    updateVehicleStatus: build.mutation<VehicleStatus, { id: string; data: UpdatedVehicleStatus }>({
      query: ({ id, data }) => ({
        url: `/vehicle-status/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["VehicleStatus"],
    }),
    deleteVehicleStatus: build.mutation<void, string>({
      query: (id) => ({
        url: `/vehicle-status/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["VehicleStatus"],
    }),

    // Vehicles
    getVehicles: build.query<Vehicle[], string | void>({
      query: (search) => ({
        url: "/vehicles",
        params: search ? { search } : {},
      }),
      providesTags: ["Vehicles"],
    }),
    createVehicle: build.mutation<Vehicle, NewVehicle>({
      query: (newVehicle) => ({
        url: "/vehicles",
        method: "POST",
        body: newVehicle,
      }),
      invalidatesTags: ["Vehicles"],
    }),
    updateVehicle: build.mutation<Vehicle, { id: string; data: UpdatedVehicle }>({
      query: ({ id, data }) => ({
        url: `/vehicles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Vehicles"],
    }),
    deleteVehicle: build.mutation<void, string>({
      query: (id) => ({
        url: `/vehicles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vehicles"],
    }), 
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetUsersQuery,
  useGetExpensesByCategoryQuery,
  useGetManufacturersQuery,
  useCreateManufacturerMutation,
  useUpdateManufacturerMutation,
  useDeleteManufacturerMutation,
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetLocationsQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
   // Vehicle Types
   useGetVehicleTypesQuery,
   useCreateVehicleTypeMutation,
   useUpdateVehicleTypeMutation,
   useDeleteVehicleTypeMutation,
 
   // Makes
   useGetMakesQuery,
   useCreateMakeMutation,
   useUpdateMakeMutation,
   useDeleteMakeMutation,
 
   // Models
   useGetModelsQuery,
   useCreateModelMutation,
   useUpdateModelMutation,
   useDeleteModelMutation,
 
   // Colors
   useGetColorsQuery,
   useCreateColorMutation,
   useUpdateColorMutation,
   useDeleteColorMutation,
 
   // Engine Types
   useGetEngineTypesQuery,
   useCreateEngineTypeMutation,
   useUpdateEngineTypeMutation,
   useDeleteEngineTypeMutation,
 
   // Fuel Types
   useGetFuelTypesQuery,
   useCreateFuelTypeMutation,
   useUpdateFuelTypeMutation,
   useDeleteFuelTypeMutation,
 
   // Transmissions
   useGetTransmissionsQuery,
   useCreateTransmissionMutation,
   useUpdateTransmissionMutation,
   useDeleteTransmissionMutation,
 
   // Vehicle Status
   useGetVehicleStatusesQuery,
   useCreateVehicleStatusMutation,
   useUpdateVehicleStatusMutation,
   useDeleteVehicleStatusMutation,
 
   // Vehicles
   useGetVehiclesQuery,
   useCreateVehicleMutation,
   useUpdateVehicleMutation,
   useDeleteVehicleMutation,
} = api;
