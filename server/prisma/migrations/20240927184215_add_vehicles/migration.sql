/*
  Warnings:

  - You are about to drop the column `isSerialized` on the `InventoryLocations` table. All the data in the column will be lost.
  - The `productId` column on the `InventoryLocations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `unitId` on the `Movements` table. All the data in the column will be lost.
  - The `productId` column on the `Movements` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `isSerialized` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the column `unitId` on the `PurchaseDetails` table. All the data in the column will be lost.
  - You are about to drop the column `unitId` on the `SaleDetails` table. All the data in the column will be lost.
  - The `productId` column on the `SaleDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `UnitLocations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Units` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufacturerId` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `productId` on the `Products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productId` on the `PurchaseDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "InventoryLocations" DROP CONSTRAINT "InventoryLocations_productId_fkey";

-- DropForeignKey
ALTER TABLE "Movements" DROP CONSTRAINT "Movements_productId_fkey";

-- DropForeignKey
ALTER TABLE "Movements" DROP CONSTRAINT "Movements_unitId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseDetails" DROP CONSTRAINT "PurchaseDetails_productId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseDetails" DROP CONSTRAINT "PurchaseDetails_unitId_fkey";

-- DropForeignKey
ALTER TABLE "SaleDetails" DROP CONSTRAINT "SaleDetails_productId_fkey";

-- DropForeignKey
ALTER TABLE "SaleDetails" DROP CONSTRAINT "SaleDetails_unitId_fkey";

-- DropForeignKey
ALTER TABLE "UnitLocations" DROP CONSTRAINT "UnitLocations_locationId_fkey";

-- DropForeignKey
ALTER TABLE "UnitLocations" DROP CONSTRAINT "UnitLocations_unitId_fkey";

-- DropForeignKey
ALTER TABLE "Units" DROP CONSTRAINT "Units_productId_fkey";

-- AlterTable
ALTER TABLE "InventoryLocations" DROP COLUMN "isSerialized",
DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER;

-- AlterTable
ALTER TABLE "Movements" DROP COLUMN "unitId",
ADD COLUMN     "vehicleId" INTEGER,
DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER;

-- AlterTable
ALTER TABLE "Products" DROP CONSTRAINT "Products_pkey",
DROP COLUMN "isSerialized",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "manufacturerId" INTEGER NOT NULL,
DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD CONSTRAINT "Products_pkey" PRIMARY KEY ("productId");

-- AlterTable
ALTER TABLE "PurchaseDetails" DROP COLUMN "unitId",
ADD COLUMN     "vehicleId" INTEGER,
DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SaleDetails" DROP COLUMN "unitId",
ADD COLUMN     "vehicleId" INTEGER,
DROP COLUMN "productId",
ADD COLUMN     "productId" INTEGER;

-- DropTable
DROP TABLE "UnitLocations";

-- DropTable
DROP TABLE "Units";

-- CreateTable
CREATE TABLE "Vehicles" (
    "vehicleId" SERIAL NOT NULL,
    "vin" TEXT,
    "internal_serial" TEXT,
    "vehicleTypeId" INTEGER NOT NULL,
    "makeId" INTEGER NOT NULL,
    "modelId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "colorId" INTEGER NOT NULL,
    "engineTypeId" INTEGER NOT NULL,
    "fuelTypeId" INTEGER,
    "transmissionId" INTEGER NOT NULL,
    "mileage" DOUBLE PRECISION NOT NULL,
    "batteryCapacity" DOUBLE PRECISION,
    "range" DOUBLE PRECISION,
    "wheelCount" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "statusId" INTEGER NOT NULL,
    "stockNumber" TEXT NOT NULL,
    "barcode" TEXT,
    "qrCode" TEXT,
    "description" TEXT,
    "mainImageUrl" TEXT,
    "additionalImages" TEXT[],
    "lastAuditDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicles_pkey" PRIMARY KEY ("vehicleId")
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
CREATE TABLE "Models" (
    "modelId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "makeId" INTEGER NOT NULL,
    "year_start" TEXT,
    "year_end" TEXT,
    "type" TEXT,
    "battery_capacity" DOUBLE PRECISION,
    "electric_range" DOUBLE PRECISION,

    CONSTRAINT "Models_pkey" PRIMARY KEY ("modelId")
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
CREATE TABLE "VehicleInventoryLocations" (
    "vehicleInventoryLocationId" SERIAL NOT NULL,
    "vehicleId" INTEGER,
    "locationId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleInventoryLocations_pkey" PRIMARY KEY ("vehicleInventoryLocationId")
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
CREATE UNIQUE INDEX "VehicleTypes_name_key" ON "VehicleTypes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Makes_name_key" ON "Makes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Models_name_key" ON "Models"("name");

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
CREATE UNIQUE INDEX "AuditTypes_name_key" ON "AuditTypes"("name");

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturers"("manufacturerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_vehicleTypeId_fkey" FOREIGN KEY ("vehicleTypeId") REFERENCES "VehicleTypes"("vehicleTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_makeId_fkey" FOREIGN KEY ("makeId") REFERENCES "Makes"("makeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Models"("modelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Colors"("colorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_engineTypeId_fkey" FOREIGN KEY ("engineTypeId") REFERENCES "EngineTypes"("engineTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_fuelTypeId_fkey" FOREIGN KEY ("fuelTypeId") REFERENCES "FuelTypes"("fuelTypeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_transmissionId_fkey" FOREIGN KEY ("transmissionId") REFERENCES "Transmissions"("transmissionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "VehicleStatus"("statusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Models" ADD CONSTRAINT "Models_makeId_fkey" FOREIGN KEY ("makeId") REFERENCES "Makes"("makeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleDetails" ADD CONSTRAINT "SaleDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleDetails" ADD CONSTRAINT "SaleDetails_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("vehicleId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLocations" ADD CONSTRAINT "InventoryLocations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleInventoryLocations" ADD CONSTRAINT "VehicleInventoryLocations_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("vehicleId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleInventoryLocations" ADD CONSTRAINT "VehicleInventoryLocations_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("locationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movements" ADD CONSTRAINT "Movements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movements" ADD CONSTRAINT "Movements_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("vehicleId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDetails" ADD CONSTRAINT "PurchaseDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDetails" ADD CONSTRAINT "PurchaseDetails_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("vehicleId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogs" ADD CONSTRAINT "AuditLogs_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("vehicleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLogs" ADD CONSTRAINT "AuditLogs_auditTypeId_fkey" FOREIGN KEY ("auditTypeId") REFERENCES "AuditTypes"("auditTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;
