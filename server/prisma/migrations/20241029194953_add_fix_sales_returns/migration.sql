/*
  Warnings:

  - You are about to drop the `ReturnSaleDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReturnSales` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReturnSaleDetails" DROP CONSTRAINT "ReturnSaleDetails_productId_fkey";

-- DropForeignKey
ALTER TABLE "ReturnSaleDetails" DROP CONSTRAINT "ReturnSaleDetails_returnId_fkey";

-- DropForeignKey
ALTER TABLE "ReturnSaleDetails" DROP CONSTRAINT "ReturnSaleDetails_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "ReturnSales" DROP CONSTRAINT "ReturnSales_locationId_fkey";

-- DropForeignKey
ALTER TABLE "ReturnSales" DROP CONSTRAINT "ReturnSales_originalSaleId_fkey";

-- DropForeignKey
ALTER TABLE "ReturnSales" DROP CONSTRAINT "ReturnSales_processedBy_fkey";

-- DropTable
DROP TABLE "ReturnSaleDetails";

-- DropTable
DROP TABLE "ReturnSales";

-- CreateTable
CREATE TABLE "SalesReturns" (
    "returnId" SERIAL NOT NULL,
    "originalSaleId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "processedBy" INTEGER,
    "locationId" INTEGER,

    CONSTRAINT "SalesReturns_pkey" PRIMARY KEY ("returnId")
);

-- CreateTable
CREATE TABLE "SaleDetailsReturns" (
    "returnDetailId" SERIAL NOT NULL,
    "returnId" INTEGER NOT NULL,
    "productId" INTEGER,
    "vehicleId" INTEGER,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "restockingFee" DOUBLE PRECISION,

    CONSTRAINT "SaleDetailsReturns_pkey" PRIMARY KEY ("returnDetailId")
);

-- AddForeignKey
ALTER TABLE "SalesReturns" ADD CONSTRAINT "SalesReturns_originalSaleId_fkey" FOREIGN KEY ("originalSaleId") REFERENCES "Sales"("saleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesReturns" ADD CONSTRAINT "SalesReturns_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("locationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesReturns" ADD CONSTRAINT "SalesReturns_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleDetailsReturns" ADD CONSTRAINT "SaleDetailsReturns_returnId_fkey" FOREIGN KEY ("returnId") REFERENCES "SalesReturns"("returnId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleDetailsReturns" ADD CONSTRAINT "SaleDetailsReturns_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleDetailsReturns" ADD CONSTRAINT "SaleDetailsReturns_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("vehicleId") ON DELETE SET NULL ON UPDATE CASCADE;
