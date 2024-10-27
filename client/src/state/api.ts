import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import numeral from "numeral";

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
  country: string;
  website: string;
  phone: string;
  mail: string;
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

export interface Family {
  familyId: string;
  name: string;
  description: string;
  makeId: number;
  make?: {
    name: string;
  };
  year_start?: string;
  year_end?: string;  
}

export interface NewFamily {
  name: string;
  description: string;
  makeId: number;
  year_start?: string;
  year_end?: string;   
}

export interface UpdatedFamily {
  name?: string;
  description?: string;
  makeId?: number;
  year_start?: string;
  year_end?: string;   
}

export interface Model {
  modelId: string;
  name: string;
  makeId: number;
  make?: {
    name: string;
  };
  familyId: number;
  family?: {
    name: string;
  };
  year_start?: string;
  year_end?: string;
  vehicleTypeId: number;
  vehicleType?: {
    name: string;
  };
  engineTypeId: number;
  engineType?: {
    name: string;
  };
  fuelTypeId: number;
  fuelType?: {
    name: string;
  };
  transmissionId: number;
  transmission?: {
    type: string;
  };
  batteryCapacity: number;
  range: number;
  wheelCount: number;
  basePrice: number;
  chargeTime: number;
  motorWattage: number;
  weightCapacity: number;
  speed: number;
  batteryVoltage: number;
  mainImageUrl?: string;
}

export interface NewModel {
  name: string;
  makeId: number;
  familyId: number;
  year_start?: string;
  year_end?: string;
  vehicleTypeId: number;
  engineTypeId: number;
  fuelTypeId: number;
  transmissionId: number;
  batteryCapacity: number;
  range: number;
  wheelCount: number;
  basePrice: number;
  chargeTime: number;
  motorWattage: number;
  weightCapacity: number;
  speed: number;
  batteryVoltage: number;
  mainImageUrl?: string;
}

export interface UpdatedModel {
  name?: string;
  makeId?: number;
  familyId?: number;
  year_start?: string;
  year_end?: string;
  vehicleTypeId: number;
  engineTypeId: number;
  fuelTypeId: number;
  transmissionId: number;
  batteryCapacity: number;
  range: number;
  wheelCount: number;
  basePrice: number;
  chargeTime: number;
  motorWattage: number;
  weightCapacity: number;
  speed: number;
  batteryVoltage: number;
  mainImageUrl?: string;
}


export interface Color {
  colorId: string;
  name: string;
  hexadecimal: string;
}

export interface NewColor {
  name: string;
  hexadecimal: string;
}

export interface UpdatedColor {
  name?: string;
  hexadecimal?: string;
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
  vehicleId: number; // Cambié a number para que coincida con el modelo
  vin?: string;
  internal_serial?: string;
  engineNumber?: string;
  makeId: number;
  familyId: number;
  modelId: number; // Cambiado de string a number
  year: number;
  colorId: number; // Cambiado de string a number
  mileage: number;
  price: number;
  conditionId: number; // Añadido para condición (nuevo/usado)
  availabilityStatusId: number; // Añadido para estado de disponibilidad
  statusId: number; // Cambiado de string a number
  locationId: number; // Añadido para ubicación
  stockNumber: string;
  barcode?: string;
  qrCode?: string;
  description?: string;
  mainImageUrl?: string;
  additionalImages?: string[];
  createdAt?: Date; // Añadido para la fecha de creación
  updatedAt?: Date; // Añadido para la fecha de actualización
  lastAuditDate?: Date; // Cambiado de string a Date
  warrantyId: number; // Cambiado a string según el modelo
  batteryWarrantyId: number; // Cambiado a string según el modelo

  // Relaciones
  model: { name: string }; // Aquí puedes incluir otros detalles del modelo si es necesario
  make: { name: string };
  color: { name: string }; // Asumiendo que color es un objeto similar
  condition: { name: string }; // Asumiendo que condición es un objeto similar
  availabilityStatus: { name: string }; // Asumiendo que estado de disponibilidad es un objeto similar
  status: { name: string }; // Asumiendo que estado es un objeto similar
  location: { name: string }; // Asumiendo que ubicación es un objeto similar
  warranty: { name: string }; // Asumiendo que garantía es un objeto similar
  batteryWarranty: { name: string }; // Asumiendo que garantía es un objeto similar
}

export interface NewVehicle {
  vin?: string;
  internal_serial?: string;
  engineNumber?: string;
  modelId: number; // Cambiado a number
  year: number;
  colorId: number; // Cambiado a number
  mileage: number;
  price: number;
  conditionId: number; // Añadido
  availabilityStatusId: number; // Añadido
  statusId: number; // Cambiado a number
  locationId: number; // Añadido
  stockNumber: string;
  barcode?: string;
  qrCode?: string;
  description?: string;
  mainImageUrl?: string;
  additionalImages?: string[];
  lastAuditDate?: Date; // Cambiado a Date
  warrantyId: number; // Cambiado a string según el modelo
  batteryWarrantyId: number;
}

export interface NewVehicleCSV {
  internal_serial: string;
  barcode?: string;
  modelName: string;
  colorName: string;
  availabilityStatusName: string;
  engineNumber?: string;
  locationId: number;
}

export interface UpdatedVehicle {
  vin?: string;
  internal_serial?: string;
  engineNumber?: string;
  familyId: number;
  modelId?: number; // Cambiado a number
  year?: number;
  colorId?: number; // Cambiado a number
  mileage?: number;
  price?: number;
  conditionId?: number; // Añadido
  availabilityStatusId?: number; // Añadido
  statusId?: number; // Cambiado a number
  locationId?: number; // Añadido
  stockNumber?: string;
  barcode?: string;
  qrCode?: string;
  description?: string;
  mainImageUrl?: string;
  additionalImages?: string[];
  lastAuditDate?: Date; // Cambiado a Date
  warrantyId?: number; // Cambiado a string según el modelo
  batteryWarrantyId?: number;
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
  userId?: number;
  username: string;
  name: string;
  email: string;
  profilePictureUrl?: string;
  cognitoId?: string;
  roleId?: number;
  locationId?: number;
  role: Role;
  locationName: string;
  roleName: string;
}

export interface NewUser {
  username: string;
  name: string;
  email: string;
  profilePictureUrl?: string;
  cognitoId?: string;
  roleId?: number;
  locationId?: number;
}

export interface UpdatedUser {
  userId?: number;
  username: string;
  name: string;
  email: string;
  profilePictureUrl?: string;
  cognitoId?: string;
  roleId?: number;
  locationId?: number;
}

export interface Role {
  roleId?: number;
  name: string;
}

export interface NewRole {
  name: string;
}

export interface UpdatedRole {
  roleId?: number;
  name: string;
}

export interface Manufacturer {
  manufacturerId: string;
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
  customerId: number;
  name: string;
  lastname?: string;
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
  lastname?: string;
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
  lastname?: string;
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

export interface AuditType {
  auditTypeId: string;
  name: string;   
}

export interface NewAuditType {
  name: string;
}

export interface UpdatedAuditType {
  name?: string;  
}

export interface Warranty {
  warrantyId: string;  // ID de la garantía, que es un UUID
  name: string;
  durationMonths: number;  // Duración de la garantía en meses   
  description?: string;  // Descripción opcional de la garantía
}

export interface NewWarranty {
  name?: string;
  durationMonths: number;  // Duración de la garantía en meses   
  description?: string;  // Descripción opcional de la garantía
}

export interface UpdatedWarranty {
  name?: string;
  durationMonths?: number;  // Duración de la garantía en meses (opcional)   
  description?: string;  // Descripción opcional de la garantía
}

export interface BatteryWarranty {
  batteryWarrantyId: string;  // ID de la garantía, que es un UUID
  name: string;
  durationMonths: number;  // Duración de la garantía en meses   
  description?: string;  // Descripción opcional de la garantía
}

export interface NewBatteryWarranty {
  name?: string;
  durationMonths: number;  // Duración de la garantía en meses   
  description?: string;  // Descripción opcional de la garantía
}

export interface UpdatedBatteryWarranty {
  name?: string;
  durationMonths?: number;  // Duración de la garantía en meses (opcional)   
  description?: string;  // Descripción opcional de la garantía
}

export interface VehicleCondition {
  conditionId: string;  // ID de la condición del vehículo
  name: string;         // Nombre de la condición (e.g., "Nuevo" o "Usado")
}

export interface NewVehicleCondition {
  name: string;         // Nombre de la condición a crear
}

export interface UpdatedVehicleCondition {
  name?: string;       // Nombre de la condición a actualizar (opcional)
}

export interface VehicleAvailabilityStatus {
  statusId: string;    // ID del estado de disponibilidad
  name: string;        // Nombre del estado (e.g., "Disponible", "Vendido", "Fuera de inventario")
}

export interface NewVehicleAvailabilityStatus {
  name: string;        // Nombre del estado de disponibilidad a crear
}

export interface UpdatedVehicleAvailabilityStatus {
  name?: string;      // Nombre del estado de disponibilidad a actualizar (opcional)
}


export interface Location {
  locationId: string;
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

export interface Sale {
  saleId: number;
  timestamp: string; // o Date dependiendo de tu preferencia
  totalAmount: number;
  paymentMethod?: string;
  customerId?: number;
  customerName: string;
  enviarADomicilio: boolean;
  recogerEnTieda: boolean;
  compraOnline: boolean;
  locationId?: number;
  locationName: string;
  customer?: Customer;  
  location?: Location;  
  saleDetails: SaleDetail[];
}

export interface NewSale {
  saleId: number;
  timestamp: string; // o Date dependiendo de tu preferencia
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  customerId?: number;
  paymentMethod?: string;
  enviarADomicilio: boolean;
  recogerEnTieda: boolean;
  compraOnline: boolean;
  locationId: number;

  saleDetails: NewSaleDetail[];
  customerData: NewCustomer;
}

export interface UpdatedSale {
  timestamp?: string; // o Date
  quantity?: number;
  unitPrice?: number;
  customerId?: number;
  saleDetails?: UpdatedSaleDetail[];
}

export interface SaleDetail {
  saleDetailId: number;
  saleId: number;
  productId?: number;
  vehicleId?: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  assemblyAndConfigurationCost?: number;
  product?: Product;
  vehicle?: Vehicle;
}

export interface NewSaleDetail {
  saleDetailId: number;
  productId?: number;
  modelId?: number;
  colorId?: number;
  isVehicle: boolean;
  vehicleId?: number | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  assemblyAndConfigurationCost: number;
}

export interface UpdatedSaleDetail {
  saleDetailId: number; // Necesario para identificar el detalle que se va a actualizar
  productId?: number;
  vehicleId?: number;
  quantity?: number;
  unitPrice?: number;
  subtotal?: number;
}

export interface VehicleCountByLocation {
  locationId: number;
  count: number;
  locationName: string;
}

export interface GroupedVehicleData {
  modelName: string;
  colorName: string;
  availabilityStatus: string;
  count: number;
}

// Define la respuesta del endpoint agrupado
export interface GetGroupedVehiclesResponse {
  groupedData: GroupedVehicleData[];
}

export interface Purchase {
  purchaseId: number; // ID de la compra
  purchaseOrder: string; // Orden de compra
  reference: string; // Referencia
  purchaseDate: Date; // Fecha de compra
  receiptMethod: string; // Método de recepción
  deliveryEstimate: Date; // Estimación de entrega
  deliveryDate?: Date; // Fecha de entrega (opcional)
  timestamp: Date; // Marca de tiempo de la creación
  paymentTerm: string; // Término de pago
  totalPurchase: number; // Total de la compra
  supplierId?: number; // ID del proveedor (opcional)
  shipmentPreference: string; // Preferencia de envío
  termsConditions: string; // Términos y condiciones
  purchaseStatus: string; // Estado de la compra
  notes: string; // Notas adicionales
  urlAttachments: string[]; // URLs de archivos adjuntos

  // Relaciones
  supplier?: Supplier; // Proveedor (opcional)
  purchaseDetails: PurchaseDetail[]; // Detalles de la compra
}

export interface NewPurchase {
  purchaseOrder: string; // Orden de compra
  reference: string; // Referencia
  purchaseDate: Date; // Fecha de compra
  receiptMethod: string; // Método de recepción
  deliveryEstimate: Date; // Estimación de entrega
  deliveryDate?: Date; // Fecha de entrega (opcional)
  timestamp: Date; // Marca de tiempo de la creación
  paymentTerm: string; // Término de pago
  totalPurchase: number; // Total de la compra
  supplierId?: number; // ID del proveedor (opcional)
  shipmentPreference: string; // Preferencia de envío
  termsConditions: string; // Términos y condiciones
  purchaseStatus: string; // Estado de la compra
  notes: string; // Notas adicionales
  urlAttachments: string[]; // URLs de archivos adjuntos

  // Relaciones
  supplier?: Supplier; // Proveedor (opcional)
  purchaseDetails: PurchaseDetail[]; // Detalles de la compra
}

export interface UpdatedPurchase {
  purchaseId: number; // ID de la compra
  purchaseOrder: string; // Orden de compra
  reference: string; // Referencia
  purchaseDate: Date; // Fecha de compra
  receiptMethod: string; // Método de recepción
  deliveryEstimate: Date; // Estimación de entrega
  deliveryDate?: Date; // Fecha de entrega (opcional)
  timestamp: Date; // Marca de tiempo de la creación
  paymentTerm: string; // Término de pago
  totalPurchase: number; // Total de la compra
  supplierId?: number; // ID del proveedor (opcional)
  shipmentPreference: string; // Preferencia de envío
  termsConditions: string; // Términos y condiciones
  purchaseStatus: string; // Estado de la compra
  notes: string; // Notas adicionales
  urlAttachments: string[]; // URLs de archivos adjuntos

  // Relaciones
  supplier?: Supplier; // Proveedor (opcional)
  purchaseDetails: PurchaseDetail[]; // Detalles de la compra
}

export interface PurchaseDetail {
  purchaseDetailId: number; // ID del detalle de la compra
  purchaseId: number; // ID de la compra
  productId?: number; // ID del producto (opcional)
  modelId?: number; // ID del modelo (opcional)
  colorId?: number; // ID del color (opcional)
  serialNumber?: string; // Número de serie (opcional)
  vehicleId?: number; // ID del vehículo (opcional)
  quantity: number; // Cantidad de productos
  unitPrice: number; // Precio unitario
  subtotal: number; // Subtotal
  expectedDate?: Date; // Fecha esperada (opcional)
  actualDate?: Date; // Fecha real (opcional)
  receptionStatus: string; // Estado de recepción
  condition?: string; // Condición (opcional)

  // Relaciones
  purchase: Purchase; // Compra a la que pertenece
  product?: Product; // Producto (opcional)
  model?: Model; // Modelo (opcional)
  color?: Color; // Color (opcional)
  vehicles?: Vehicle; // Vehículo (opcional)
}

export interface VehicleColor {
  colorId: number;
  colorName: string;
  hexadecimal: string;
  count: number;
}

export interface VehicleModelSummary {
  modelId: number;
  modelName: string;
  makeId: number;
  familyId: number;
  year_start: "2015";
  year_end: "";
  vehicleTypeId: number;
  vehicleType: string;
  engineTypeId: number;
  fuelTypeId: number;
  transmissionId:number;
  batteryCapacity: number;
  range: number;
  wheelCount: number;
  basePrice: number;
  chargeTime: number;
  motorWattage: number;
  weightCapacity: number;
  speed: number;
  batteryVoltage:number;
  count: number;
  colors: VehicleColor[];
}

export interface VehicleMovement {
  vehicleId: number,
  internal_serial:string,
  modelName: string,
  colorName: string,
}

export interface Movement {
  movementId: number;
  fromLocationId?: number | null;  // Puede ser opcional para ciertos tipos de movimientos
  toLocationId?: number | null;    // Puede ser opcional para ciertos tipos de movimientos
  quantity?: number | null;        // Solo se usa cuando hay productos involucrados
  movementType: string;  // Definir los tipos de movimiento como uniones de string
  movementDate: string;            // Fecha del movimiento en formato ISO
  orderReference?: string | null;  // Referencia de la orden, puede ser opcional
  status: string;  // Estados posibles del movimiento
  notes?: string | null;           // Notas adicionales
  approved: boolean;               // Indica si el movimiento fue aprobado
  createdBy: string;               // Usuario que creó el movimiento
  approvedBy?: string | null;      // Usuario que aprobó el movimiento, puede ser opcional
  lastUpdatedAt: string;           // Fecha de la última actualización en formato ISO

  fromLocation: { name: string };
  toLocation?: { name: string };
  fromLocationName: string;
  toLocationName: string;

  details: MovementDetail[];   
  
  vehicles: VehicleMovement[]; 

  arrivalDate?:      Date;    
  receivedBy?:       string;
  isReceived?:       Boolean;
  receptionNotes?:  string | null; 
}

export interface NewMovement {
  fromLocationId?: number | null;
  toLocationId?: number | null;
  quantity?: number | null;
  movementType: string;
  movementDate?: string;    // Se puede opcional si la fecha es generada automáticamente
  orderReference?: string | null;
  status: string;
  notes?: string | null;
  approved?: boolean;        // Puede ser opcional al crear un nuevo movimiento
  createdBy: string;
  details: NewMovementDetail[];  // Colección de detalles del movimiento que se está creando
}

export interface MovementDetail {
  movementDetailId: number;        // ID del detalle de movimiento
  movementId: number;              // ID del movimiento al que pertenece
  vehicleId?: number | null;       // Si es un vehículo, este campo será completado
  productId?: number | null;       // Si es un producto, este campo será completado
  inspectionStatus: string;  // Estado de la inspección

  movement: Movement;              // Relación con el movimiento padre
  vehicle?: Vehicle | null;        // Relación con un vehículo
  product?: Product | null;        // Relación con un producto

  arrivalDate?:      Date;    
  receivedBy?:       string;
  isReceived?:       Boolean;
  receptionNotes?:  string | null; 
}

export interface NewMovementDetail {
  vehicleId?: number | null;       // Opcional si se trata de un producto
  productId?: number | null;       // Opcional si se trata de un vehículo
  inspectionStatus: string;  // Estado inicial de la inspección
}     

export interface UpdatedMovement {   
  arrivalDate:      Date;    
  receivedBy:       string;
  isReceived:       Boolean;
  receptionNotes?:  string | null; 
}

export interface Item {
  id: number;
  name: string;
  price: number;
  imagePath: string;
}

export interface CartItem {
  item: Item;
  qty: number;
}
export interface Organization {
  name: string;           // Nombre de la organización
  rfc: string;           // Registro Federal de Contribuyentes
  commercialName?: string; // Nombre comercial
  responsiblePerson?: string; // Persona responsable
  address: string;       // Dirección
  address2?: string;
  neighborhood?:string;
  city: string;         // Ciudad
  state: string;        // Estado
  postalCode: string;   // Código postal
  country: string;      // País
  phone?: string; // Número de teléfono
  email?: string;       // Correo electrónico
  purchaseOrderPrefix?: string;  // Prefijo para órdenes de compra
  saleOrderPrefix?: string;      // Prefijo para órdenes de venta
  invoicePrefix?: string;        // Prefijo para facturas
  startingOrderNumber?: number;  // Número inicial de órdenes de venta
  startingInvoiceNumber?: number;  // Número inicial de facturas
  startingPurchaseOrderNumber?: number;  // Número inicial de órdenes de compra
  createdAt?: Date;     // Fecha de creación
  updatedAt?: Date;     // Fecha de actualización
  logoUrl?: string;  
}

export interface NewOrganization {
  name: string;           // Nombre de la organización
  rfc: string;           // Registro Federal de Contribuyentes
  commercialName?: string; // Nombre comercial
  responsiblePerson?: string; // Persona responsable
  address: string;       // Dirección
  address2?: string;
  neighborhood?:string;
  city: string;         // Ciudad
  state: string;        // Estado
  postalCode: string;   // Código postal
  country: string;      // País
  phone?: string; // Número de teléfono
  email?: string;       // Correo electrónico
  purchaseOrderPrefix?: string;  // Prefijo para órdenes de compra
  saleOrderPrefix?: string;      // Prefijo para órdenes de venta
  invoicePrefix?: string;        // Prefijo para facturas
  startingOrderNumber?: number;  // Número inicial de órdenes de venta
  startingInvoiceNumber?: number;  // Número inicial de facturas
  startingPurchaseOrderNumber?: number;  // Número inicial de órdenes de compra
  logoUrl?: string;  
}

export interface UpdatedOrganization {
  name?: string;           // Nombre de la organización
  rfc?: string;           // Registro Federal de Contribuyentes
  commercialName?: string; // Nombre comercial
  responsiblePerson?: string; // Persona responsable
  address?: string;       // Dirección
  address2?: string;
  neighborhood?:string;
  city?: string;         // Ciudad
  state?: string;        // Estado
  postalCode?: string;   // Código postal
  country?: string;      // País
  phone?: string; // Número de teléfono
  email?: string;       // Correo electrónico
  purchaseOrderPrefix?: string;  // Prefijo para órdenes de compra
  saleOrderPrefix?: string;      // Prefijo para órdenes de venta
  invoicePrefix?: string;        // Prefijo para facturas
  startingOrderNumber?: number;  // Número inicial de órdenes de venta
  startingInvoiceNumber?: number;  // Número inicial de facturas
  startingPurchaseOrderNumber?: number;  // Número inicial de órdenes de compra
  logoUrl?: string;  
}

export interface EmailData {
  to: string;
  subject: string;
  text: string;
}

export interface SendMailResponse {
  message: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Products", "Users", "Roles","Expenses","Manufacturers","Customers","Suppliers","Categories","Locations",
    "VehicleTypes",
    "Makes",
    "Models",
    "Families",
    "Colors",
    "EngineTypes",
    "FuelTypes",
    "Transmissions",
    "VehicleStatus",
    "Vehicles",
    "Sales",
    "AuditTypes",
    "Warranties",
    "VehicleConditions",
    "VehicleAvailabilityStatus",
    "BatteryWarranties",
    "Inventory",
    "Purchases",
    "Movements",
    "Organizations",
    "Notas",
  ],
  endpoints: (build) => ({

    getAuthUser: build.query({
      queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const user = await getCurrentUser();
          const session = await fetchAuthSession();
          if (!session) throw new Error("No session found");
          const { userSub } = session;
          const { accessToken } = session.tokens ?? {};

          const userDetailsResponse = await fetchWithBQ(`users/${userSub}`);
          const userDetails = userDetailsResponse.data as User;

          return { data: { user, userSub, userDetails } };
        } catch (error: any) {
          return { error: error.message || "Could not fetch user data" };
        }
      },
    }),

    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),

    getOrganizations: build.query<Organization[], string | void>({
      query: (search) => ({
        url: "/organizations",
        params: search ? { search } : {},
      }),
      providesTags: ["Organizations"],
    }),
    createOrganization: build.mutation<Organization, UpdatedOrganization>({
      query: (newOrganization) => ({
        url: "/organizations",
        method: "POST",
        body: newOrganization,
      }),
      invalidatesTags: ["Organizations"],
    }),
    updateOrganization: build.mutation<Organization, { id: string; data: UpdatedOrganization }>({
      query: ({ id, data }) => ({
        url: `/organizations/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Organizations"],
    }),
    getOrganizationById: build.query<Organization, string>({
      query: (id) => `/organizations/${id}`,
      providesTags: ["Organizations"],
    }),
    deleteOrganization: build.mutation<void, string>({
      query: (id) => ({
        url: `/organizations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Organizations"],
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
 
    createUser: build.mutation<User, NewUser>({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: build.mutation<User, { id: string; data: UpdatedUser }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    getRoles: build.query<Role[], void>({
      query: () => "/roles",
      providesTags: ["Roles"],
    }),
    getRoleById: build.query<Role, string>({
      query: (id) => ({
        url: `/roles/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Roles", id }],
    }),
    createRole: build.mutation<Role, NewRole>({
      query: (newRole) => ({
        url: "/roles",
        method: "POST",
        body: newRole,
      }),
      invalidatesTags: ["Roles"],
    }),
    updateRole: build.mutation<Role, { id: string; data: UpdatedRole }>({
      query: ({ id, data }) => ({
        url: `/roles/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Roles"],
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
    getAuditTypes: build.query<AuditType[], string | void>({
      query: (search) => ({
        url: "/audit-types",
        params: search ? { search } : {},
      }),
      providesTags: ["AuditTypes"],
    }),
    createAuditType: build.mutation<AuditType, NewAuditType>({
      query: (newAuditType) => ({
        url: "/audit-types",
        method: "POST",
        body: newAuditType,
      }),
      invalidatesTags: ["AuditTypes"],
    }),
    updateAuditType: build.mutation<AuditType, { id: string; data: UpdatedAuditType }>({
      query: ({ id, data }) => ({
        url: `/audit-types/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AuditTypes"],
    }),
    deleteAuditType: build.mutation<void, string>({
      query: (id) => ({
        url: `/audit-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AuditTypes"],
    }),
    getWarranties: build.query<Warranty[], string | void>({
      query: (search) => ({
        url: "/warranties",
        params: search ? { search } : {},
      }),
      providesTags: ["Warranties"],
    }),
    createWarranty: build.mutation<Warranty, NewWarranty>({
      query: (newWarranty) => ({
        url: "/warranties",
        method: "POST",
        body: newWarranty,
      }),
      invalidatesTags: ["Warranties"],
    }),
    updateWarranty: build.mutation<Warranty, { id: string; data: UpdatedWarranty }>({
      query: ({ id, data }) => ({
        url: `/warranties/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Warranties"],
    }),
    deleteWarranty: build.mutation<void, string>({
      query: (id) => ({
        url: `/warranties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Warranties"],
    }),
    getBatteryWarranties: build.query<BatteryWarranty[], string | void>({
      query: (search) => ({
        url: "/battery-warranties",
        params: search ? { search } : {},
      }),
      providesTags: ["BatteryWarranties"],
    }),
    createBatteryWarranty: build.mutation<BatteryWarranty, NewBatteryWarranty>({
      query: (newBatteryWarranty) => ({
        url: "/battery-warranties",
        method: "POST",
        body: newBatteryWarranty,
      }),
      invalidatesTags: ["BatteryWarranties"],
    }),
    updateBatteryWarranty: build.mutation<BatteryWarranty, { id: string; data: UpdatedBatteryWarranty }>({
      query: ({ id, data }) => ({
        url: `/battery-warranties/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["BatteryWarranties"],
    }),
    deleteBatteryWarranty: build.mutation<void, string>({
      query: (id) => ({
        url: `/battery-warranties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BatteryWarranties"],
    }),
    getVehicleConditions: build.query<VehicleCondition[], string | void>({
      query: (search) => ({
        url: "/vehicle-conditions",
        params: search ? { search } : {},
      }),
      providesTags: ["VehicleConditions"],
    }),
    createVehicleCondition: build.mutation<VehicleCondition, NewVehicleCondition>({
      query: (newVehicleCondition) => ({
        url: "/vehicle-conditions",
        method: "POST",
        body: newVehicleCondition,
      }),
      invalidatesTags: ["VehicleConditions"],
    }),
    updateVehicleCondition: build.mutation<VehicleCondition, { id: string; data: UpdatedVehicleCondition }>({
      query: ({ id, data }) => ({
        url: `/vehicle-conditions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["VehicleConditions"],
    }),
    deleteVehicleCondition: build.mutation<void, string>({
      query: (id) => ({
        url: `/vehicle-conditions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["VehicleConditions"],
    }),
    getVehicleAvailabilityStatuses: build.query<VehicleAvailabilityStatus[], string | void>({
      query: (search) => ({
        url: "/vehicle-availability-status",
        params: search ? { search } : {},
      }),
      providesTags: ["VehicleAvailabilityStatus"],
    }),
    createVehicleAvailabilityStatus: build.mutation<VehicleAvailabilityStatus, NewVehicleAvailabilityStatus>({
      query: (newVehicleAvailabilityStatus) => ({
        url: "/vehicle-availability-status",
        method: "POST",
        body: newVehicleAvailabilityStatus,
      }),
      invalidatesTags: ["VehicleAvailabilityStatus"],
    }),
    updateVehicleAvailabilityStatus: build.mutation<VehicleAvailabilityStatus, { id: string; data: UpdatedVehicleAvailabilityStatus }>({
      query: ({ id, data }) => ({
        url: `/vehicle-availability-status/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["VehicleAvailabilityStatus"],
    }),
    deleteVehicleAvailabilityStatus: build.mutation<void, string>({
      query: (id) => ({
        url: `/vehicle-availability-status/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["VehicleAvailabilityStatus"],
    }),    
    getLocations: build.query<Location[], string | void>({
      query: (search) => ({
        url: "/locations",
        params: search ? { search } : {},
      }),
      providesTags: ["Locations"],
    }),    
    getLocationsByUsername: build.query<Location[], string>({
      query: (username) => `/locations/byUser/${username}`,
      providesTags: ['Locations'],
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

     // Families
     getFamilies: build.query<Family[], { search?: string; makeId?: number }>({
      query: ({ search, makeId }) => ({
        url: "/families",
        params: {
          ...(search ? { search } : {}), // Si hay una búsqueda, incluirla en los parámetros
          ...(makeId ? { makeId } : {}), // Si hay un makeId, incluirlo en los parámetros
        },
      }),
      providesTags: ["Families"],
    }),
    createFamily: build.mutation<Family, NewFamily>({
      query: (newFamily) => ({
        url: "/families",
        method: "POST",
        body: newFamily,
      }),
      invalidatesTags: ["Families"],
    }),
    updateFamily: build.mutation<Family, { id: string; data: UpdatedFamily }>({
      query: ({ id, data }) => ({
        url: `/families/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Families"],
    }),
    deleteFamily: build.mutation<void, string>({
      query: (id) => ({
        url: `/families/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Families"],
    }),

    // Models
    getModels: build.query<Model[], { search?: string; familyId?: number } | void>({
      query: ({ search, familyId } = {}) => ({
        url: "/models",
        params: {
          ...(search ? { search } : {}),
          ...(familyId ? { familyId } : {}),
        },
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
    getVehicleById: build.query<Vehicle, string>({
      query: (id) => ({
        url: `/vehicles/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Vehicles", id }],
    }),
    getVehiclesByLocationId: build.query<Vehicle[], string>({
      query: (locationId) => ({
        url: `/vehicles/vehiclesByLocation?locationId=${locationId}`,
      }),
      providesTags: (result, error, locationId) => [{ type: "Vehicles", locationId }],
    }),
    getVehicleSummaryByModelAndColor: build.query<VehicleModelSummary[], { locationId: string, modelId?: string }>({
      query: ({ locationId, modelId }) => {
        let url = `/vehicles/modelsBySucursal?locationId=${locationId}`;
        if (modelId) {
          url += `&modelId=${modelId}`;  // Añadir modelId al query string si está presente
        }
        return { url };
      },
      providesTags: (result, error, locationId) => [{ type: "Vehicles", locationId }],
    }),
    createVehicle: build.mutation<Vehicle, NewVehicle>({
      query: (newVehicle) => ({
        url: "/vehicles",
        method: "POST",
        body: newVehicle,
      }),
      invalidatesTags: ["Vehicles"],
    }),
    createVehicleFromCSV: build.mutation<Vehicle, NewVehicleCSV>({
      query: (newVehicleCSV) => ({
        url: "/vehicles/csv",
        method: "POST",
        body: newVehicleCSV,
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
    getVehiclesCountByLocation: build.query<VehicleCountByLocation[], void>({
      query: () => ({
        url: "/inventory/counts",
      }),
      providesTags: ["Inventory"],
    }),
    getGroupedVehicles: build.query<GetGroupedVehiclesResponse, number | null>({
      query: (locationId) => ({
        url: '/inventory/count-by-model-color-status',
        params: locationId ? { locationId } : {},
      }),
    }),

    getPurchases: build.query<Purchase[], string | void>({
      query: (search) => ({
        url: "/purchases",
        params: search ? { search } : {},
      }),
      providesTags: ["Purchases"],
    }),
    getPurchaseById: build.query<Purchase, string>({
      query: (id) => ({
        url: `/purchases/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Purchases", id }],
    }),
    createPurchase: build.mutation<Purchase, NewPurchase>({
      query: (newPurchase) => ({
        url: "/purchases",
        method: "POST",
        body: newPurchase,
      }),
      invalidatesTags: ["Purchases"],
    }),
    updatePurchase: build.mutation<Purchase, { id: string; data: UpdatedPurchase }>({
      query: ({ id, data }) => ({
        url: `/purchases/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Purchases"],
    }),
    deletePurchase: build.mutation<void, string>({
      query: (id) => ({
        url: `/purchases/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Purchases"],
    }),

    getSales: build.query<Sale[], string | void>({
      query: (search) => ({
        url: "/sales",
        params: search ? { search } : {},
      }),
      providesTags: ["Sales"],
    }),
    getSaleById: build.query<Sale, string>({
      query: (id) => ({
        url: `/sales/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Sales", id }],
    }),
    createSale: build.mutation<Sale, NewSale>({
      query: (newSale) => ({
        url: "/sales",
        method: "POST",
        body: newSale,
      }),
      invalidatesTags: ["Sales"],
    }),
    updateSale: build.mutation<Sale, { id: string; data: UpdatedSale }>({
      query: ({ id, data }) => ({
        url: `/sales/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Sales"],
    }),
    deleteSale: build.mutation<void, string>({
      query: (id) => ({
        url: `/sales/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sales"],
    }),

    getMovements: build.query<Movement[], string | void>({
      query: (search) => ({
        url: "/movements",
        params: search ? { search } : {},
      }),
      providesTags: ["Movements"],
    }),
    getMovementById: build.query<Movement, string>({
      query: (id) => ({
        url: `/movements/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Movements", id }],
    }),
    createMovement: build.mutation<Movement, NewMovement>({
      query: (newMovement) => ({
        url: "/movements",
        method: "POST",
        body: newMovement,
      }),
      invalidatesTags: ["Movements"],
    }),
    updateMovement: build.mutation<Movement, { id: string; data: UpdatedMovement }>({
      query: ({ id, data }) => ({
        url: `/movements/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Movements"],
    }),
    deleteMovement: build.mutation<void, string>({
      query: (id) => ({
        url: `/movements/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Movements"],
    }),

    sendMail: build.mutation<SendMailResponse, EmailData>({
      query: (emailData) => ({
        url: "/send-email",  
        method: "POST",
        body: emailData,
      }),
    }),

    generateDownloadPdf: build.query<Blob, string>({
      query: (id) => ({
        url: `/nota-pdf/${id}`,
        responseHandler: (response) => response.blob(), // Esto asegura que se maneje como Blob
        responseType: 'blob', // Asegura que sea binario
      }),
    }),

    generateSendPdf: build.mutation<string, string>({
      query: (id) => ({
        url:  `/nota-pdf/send/${id}`,
        method: 'GET', 
      }),
    }),
 
  }),
});

export const {

  useGetAuthUserQuery,

  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
 
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useGetRoleByIdQuery,

  useGetDashboardMetricsQuery,

  useSendMailMutation,
  useGenerateDownloadPdfQuery,
  useGenerateSendPdfMutation,

  useGetOrganizationsQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useGetOrganizationByIdQuery,
  useDeleteOrganizationMutation,

  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,

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

  useGetAuditTypesQuery,
  useCreateAuditTypeMutation,
  useUpdateAuditTypeMutation,
  useDeleteAuditTypeMutation,

  useGetWarrantiesQuery,
  useCreateWarrantyMutation,
  useUpdateWarrantyMutation,
  useDeleteWarrantyMutation,

  useGetBatteryWarrantiesQuery,
  useCreateBatteryWarrantyMutation,
  useUpdateBatteryWarrantyMutation,
  useDeleteBatteryWarrantyMutation,

  useGetVehicleConditionsQuery,
  useCreateVehicleConditionMutation,
  useUpdateVehicleConditionMutation,
  useDeleteVehicleConditionMutation,

  useGetVehicleAvailabilityStatusesQuery,
  useCreateVehicleAvailabilityStatusMutation,
  useUpdateVehicleAvailabilityStatusMutation,
  useDeleteVehicleAvailabilityStatusMutation,

  useGetLocationsQuery,
  useGetLocationsByUsernameQuery,
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

    // Families
    useGetFamiliesQuery,
    useCreateFamilyMutation,
    useUpdateFamilyMutation,
    useDeleteFamilyMutation,
 
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
   useGetVehicleByIdQuery,
   useGetVehicleSummaryByModelAndColorQuery,
   useGetVehiclesByLocationIdQuery,
   useCreateVehicleMutation,
   useCreateVehicleFromCSVMutation,
   useUpdateVehicleMutation,
   useDeleteVehicleMutation,

   useGetPurchasesQuery,
   useGetPurchaseByIdQuery,
   useCreatePurchaseMutation,
   useUpdatePurchaseMutation,
   useDeletePurchaseMutation,

   useGetSalesQuery,
   useGetSaleByIdQuery,
   useCreateSaleMutation,
   useUpdateSaleMutation,
   useDeleteSaleMutation,

   useGetMovementsQuery,
   useGetMovementByIdQuery,
   useCreateMovementMutation,
   useUpdateMovementMutation,
   useDeleteMovementMutation,

   //INVENTARIO
   useGetVehiclesCountByLocationQuery,
   useGetGroupedVehiclesQuery,
} = api;
