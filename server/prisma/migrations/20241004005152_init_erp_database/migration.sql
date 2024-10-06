-- CreateTable
CREATE TABLE "Users" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Roles" (
    "roleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("roleId")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "permissionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("permissionId")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
    "productId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "rating" DOUBLE PRECISION,
    "stockQuantity" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "manufacturerId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "mainImageUrl" TEXT,
    "additionalImages" TEXT[],

    CONSTRAINT "Products_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "Categories" (
    "categoryId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "Manufacturers" (
    "manufacturerId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "contact_info" TEXT,

    CONSTRAINT "Manufacturers_pkey" PRIMARY KEY ("manufacturerId")
);

-- CreateTable
CREATE TABLE "Vehicles" (
    "vehicleId" SERIAL NOT NULL,
    "vin" TEXT,
    "internal_serial" TEXT,
    "modelId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "colorId" INTEGER NOT NULL,
    "mileage" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "conditionId" INTEGER NOT NULL,
    "availabilityStatusId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "stockNumber" TEXT NOT NULL,
    "barcode" TEXT,
    "qrCode" TEXT,
    "description" TEXT,
    "mainImageUrl" TEXT,
    "additionalImages" TEXT[],
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "lastAuditDate" TIMESTAMP(3),
    "warrantyId" TEXT NOT NULL,

    CONSTRAINT "Vehicles_pkey" PRIMARY KEY ("vehicleId")
);

-- CreateTable
CREATE TABLE "Models" (
    "modelId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "makeId" INTEGER NOT NULL,
    "year_start" TEXT,
    "year_end" TEXT,
    "vehicleTypeId" INTEGER NOT NULL,
    "engineTypeId" INTEGER NOT NULL,
    "fuelTypeId" INTEGER,
    "transmissionId" INTEGER NOT NULL,
    "batteryCapacity" DOUBLE PRECISION,
    "range" DOUBLE PRECISION,
    "wheelCount" INTEGER NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "chargeTime" DOUBLE PRECISION NOT NULL,
    "motorWattage" INTEGER,
    "weightCapacity" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION NOT NULL,
    "batteryVoltage" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Models_pkey" PRIMARY KEY ("modelId")
);

-- CreateTable
CREATE TABLE "VehicleTypes" (
    "vehicleTypeId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "VehicleTypes_pkey" PRIMARY KEY ("vehicleTypeId")
);

-- CreateTable
CREATE TABLE "Makes" (
    "makeId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "mail" TEXT,

    CONSTRAINT "Makes_pkey" PRIMARY KEY ("makeId")
);

-- CreateTable
CREATE TABLE "VehicleCondition" (
    "conditionId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "VehicleCondition_pkey" PRIMARY KEY ("conditionId")
);

-- CreateTable
CREATE TABLE "VehicleAvailabilityStatus" (
    "statusId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "VehicleAvailabilityStatus_pkey" PRIMARY KEY ("statusId")
);

-- CreateTable
CREATE TABLE "Colors" (
    "colorId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Colors_pkey" PRIMARY KEY ("colorId")
);

-- CreateTable
CREATE TABLE "EngineTypes" (
    "engineTypeId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "EngineTypes_pkey" PRIMARY KEY ("engineTypeId")
);

-- CreateTable
CREATE TABLE "FuelTypes" (
    "fuelTypeId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FuelTypes_pkey" PRIMARY KEY ("fuelTypeId")
);

-- CreateTable
CREATE TABLE "Transmissions" (
    "transmissionId" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Transmissions_pkey" PRIMARY KEY ("transmissionId")
);

-- CreateTable
CREATE TABLE "VehicleStatus" (
    "statusId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "VehicleStatus_pkey" PRIMARY KEY ("statusId")
);

-- CreateTable
CREATE TABLE "Warranty" (
    "warrantyId" TEXT NOT NULL,
    "durationMonths" INTEGER NOT NULL,
    "batteryDuration" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "Warranty_pkey" PRIMARY KEY ("warrantyId")
);

-- CreateTable
CREATE TABLE "Sales" (
    "saleId" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "customerId" INTEGER,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("saleId")
);

-- CreateTable
CREATE TABLE "SaleDetails" (
    "saleDetailId" SERIAL NOT NULL,
    "saleId" INTEGER NOT NULL,
    "productId" INTEGER,
    "vehicleId" INTEGER,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SaleDetails_pkey" PRIMARY KEY ("saleDetailId")
);

-- CreateTable
CREATE TABLE "Locations" (
    "locationId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "managerId" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "mainImageUrl" TEXT,
    "additionalImages" TEXT[],

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("locationId")
);

-- CreateTable
CREATE TABLE "InventoryLocations" (
    "inventoryLocationId" SERIAL NOT NULL,
    "productId" INTEGER,
    "locationId" INTEGER NOT NULL,
    "quantity_in_stock" INTEGER,
    "last_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryLocations_pkey" PRIMARY KEY ("inventoryLocationId")
);

-- CreateTable
CREATE TABLE "VehicleInventoryLocations" (
    "vehicleInventoryLocationId" SERIAL NOT NULL,
    "vehicleId" INTEGER,
    "locationId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleInventoryLocations_pkey" PRIMARY KEY ("vehicleInventoryLocationId")
);

-- CreateTable
CREATE TABLE "Movements" (
    "movementId" SERIAL NOT NULL,
    "productId" INTEGER,
    "vehicleId" INTEGER,
    "fromLocationId" INTEGER NOT NULL,
    "toLocationId" INTEGER NOT NULL,
    "quantity" INTEGER,
    "movementType" TEXT NOT NULL,
    "movementDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movements_pkey" PRIMARY KEY ("movementId")
);

-- CreateTable
CREATE TABLE "Customers" (
    "customerId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "mainImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("customerId")
);

-- CreateTable
CREATE TABLE "Suppliers" (
    "supplierId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "mainImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Suppliers_pkey" PRIMARY KEY ("supplierId")
);

-- CreateTable
CREATE TABLE "Purchases" (
    "purchaseId" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "supplierId" INTEGER,

    CONSTRAINT "Purchases_pkey" PRIMARY KEY ("purchaseId")
);

-- CreateTable
CREATE TABLE "PurchaseDetails" (
    "purchaseDetailId" SERIAL NOT NULL,
    "purchaseId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "vehicleId" INTEGER,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PurchaseDetails_pkey" PRIMARY KEY ("purchaseDetailId")
);

-- CreateTable
CREATE TABLE "AuditLogs" (
    "auditLogId" SERIAL NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "auditDate" TIMESTAMP(3) NOT NULL,
    "auditTypeId" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLogs_pkey" PRIMARY KEY ("auditLogId")
);

-- CreateTable
CREATE TABLE "AuditTypes" (
    "auditTypeId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AuditTypes_pkey" PRIMARY KEY ("auditTypeId")
);

-- CreateTable
CREATE TABLE "Expenses" (
    "expenseId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expenses_pkey" PRIMARY KEY ("expenseId")
);

-- CreateTable
CREATE TABLE "SalesSummary" (
    "salesSummaryId" TEXT NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "changePercentage" DOUBLE PRECISION,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesSummary_pkey" PRIMARY KEY ("salesSummaryId")
);

-- CreateTable
CREATE TABLE "PurchaseSummary" (
    "purchaseSummaryId" TEXT NOT NULL,
    "totalPurchased" DOUBLE PRECISION NOT NULL,
    "changePercentage" DOUBLE PRECISION,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseSummary_pkey" PRIMARY KEY ("purchaseSummaryId")
);

-- CreateTable
CREATE TABLE "ExpenseSummary" (
    "expenseSummaryId" TEXT NOT NULL,
    "totalExpenses" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpenseSummary_pkey" PRIMARY KEY ("expenseSummaryId")
);

-- CreateTable
CREATE TABLE "ExpenseByCategory" (
    "expenseByCategoryId" TEXT NOT NULL,
    "expenseSummaryId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpenseByCategory_pkey" PRIMARY KEY ("expenseByCategoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_name_key" ON "Roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_name_key" ON "Permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_vin_key" ON "Vehicles"("vin");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_internal_serial_key" ON "Vehicles"("internal_serial");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_stockNumber_key" ON "Vehicles"("stockNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_barcode_key" ON "Vehicles"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_qrCode_key" ON "Vehicles"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "Models_name_key" ON "Models"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleTypes_name_key" ON "VehicleTypes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Makes_name_key" ON "Makes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Colors_name_key" ON "Colors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EngineTypes_name_key" ON "EngineTypes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FuelTypes_name_key" ON "FuelTypes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Transmissions_type_key" ON "Transmissions"("type");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleStatus_name_key" ON "VehicleStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_email_key" ON "Customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AuditTypes_name_key" ON "AuditTypes"("name");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permissions"("permissionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturers"("manufacturerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("locationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "VehicleStatus"("statusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Models"("modelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Colors"("colorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "VehicleCondition"("conditionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_availabilityStatusId_fkey" FOREIGN KEY ("availabilityStatusId") REFERENCES "VehicleAvailabilityStatus"("statusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("locationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_warrantyId_fkey" FOREIGN KEY ("warrantyId") REFERENCES "Warranty"("warrantyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Models" ADD CONSTRAINT "Models_makeId_fkey" FOREIGN KEY ("makeId") REFERENCES "Makes"("makeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Models" ADD CONSTRAINT "Models_vehicleTypeId_fkey" FOREIGN KEY ("vehicleTypeId") REFERENCES "VehicleTypes"("vehicleTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Models" ADD CONSTRAINT "Models_engineTypeId_fkey" FOREIGN KEY ("engineTypeId") REFERENCES "EngineTypes"("engineTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Models" ADD CONSTRAINT "Models_fuelTypeId_fkey" FOREIGN KEY ("fuelTypeId") REFERENCES "FuelTypes"("fuelTypeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Models" ADD CONSTRAINT "Models_transmissionId_fkey" FOREIGN KEY ("transmissionId") REFERENCES "Transmissions"("transmissionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("customerId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleDetails" ADD CONSTRAINT "SaleDetails_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sales"("saleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleDetails" ADD CONSTRAINT "SaleDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleDetails" ADD CONSTRAINT "SaleDetails_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("vehicleId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locations" ADD CONSTRAINT "Locations_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLocations" ADD CONSTRAINT "InventoryLocations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLocations" ADD CONSTRAINT "InventoryLocations_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("locationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleInventoryLocations" ADD CONSTRAINT "VehicleInventoryLocations_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("vehicleId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleInventoryLocations" ADD CONSTRAINT "VehicleInventoryLocations_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("locationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movements" ADD CONSTRAINT "Movements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movements" ADD CONSTRAINT "Movements_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("vehicleId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movements" ADD CONSTRAINT "Movements_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES "Locations"("locationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movements" ADD CONSTRAINT "Movements_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES "Locations"("locationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchases" ADD CONSTRAINT "Purchases_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Suppliers"("supplierId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDetails" ADD CONSTRAINT "PurchaseDetails_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchases"("purchaseId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDetails" ADD CONSTRAINT "PurchaseDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDetails" ADD CONSTRAINT "PurchaseDetails_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("vehicleId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogs" ADD CONSTRAINT "AuditLogs_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("vehicleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogs" ADD CONSTRAINT "AuditLogs_auditTypeId_fkey" FOREIGN KEY ("auditTypeId") REFERENCES "AuditTypes"("auditTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseByCategory" ADD CONSTRAINT "ExpenseByCategory_expenseSummaryId_fkey" FOREIGN KEY ("expenseSummaryId") REFERENCES "ExpenseSummary"("expenseSummaryId") ON DELETE RESTRICT ON UPDATE CASCADE;
