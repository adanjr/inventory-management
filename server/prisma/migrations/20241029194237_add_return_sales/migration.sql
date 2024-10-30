-- CreateTable
CREATE TABLE "ReturnSales" (
    "returnId" SERIAL NOT NULL,
    "originalSaleId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "processedBy" INTEGER,
    "locationId" INTEGER,

    CONSTRAINT "ReturnSales_pkey" PRIMARY KEY ("returnId")
);

-- CreateTable
CREATE TABLE "ReturnSaleDetails" (
    "returnDetailId" SERIAL NOT NULL,
    "returnId" INTEGER NOT NULL,
    "productId" INTEGER,
    "vehicleId" INTEGER,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "restockingFee" DOUBLE PRECISION,

    CONSTRAINT "ReturnSaleDetails_pkey" PRIMARY KEY ("returnDetailId")
);

-- AddForeignKey
ALTER TABLE "ReturnSales" ADD CONSTRAINT "ReturnSales_originalSaleId_fkey" FOREIGN KEY ("originalSaleId") REFERENCES "Sales"("saleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnSales" ADD CONSTRAINT "ReturnSales_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("locationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnSales" ADD CONSTRAINT "ReturnSales_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnSaleDetails" ADD CONSTRAINT "ReturnSaleDetails_returnId_fkey" FOREIGN KEY ("returnId") REFERENCES "ReturnSales"("returnId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnSaleDetails" ADD CONSTRAINT "ReturnSaleDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnSaleDetails" ADD CONSTRAINT "ReturnSaleDetails_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("vehicleId") ON DELETE SET NULL ON UPDATE CASCADE;
