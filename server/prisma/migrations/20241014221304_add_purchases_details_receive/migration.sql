/*
  Warnings:

  - You are about to drop the column `totalCost` on the `Purchases` table. All the data in the column will be lost.
  - Added the required column `receptionStatus` to the `PurchaseDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryEstimate` to the `Purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notes` to the `Purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentTerm` to the `Purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseDate` to the `Purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseOrder` to the `Purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchaseStatus` to the `Purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiptMethod` to the `Purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipmentPreference` to the `Purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termsConditions` to the `Purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPurchase` to the `Purchases` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PurchaseDetails" DROP CONSTRAINT "PurchaseDetails_productId_fkey";

-- AlterTable
ALTER TABLE "PurchaseDetails" ADD COLUMN     "colorId" INTEGER,
ADD COLUMN     "condition" TEXT,
ADD COLUMN     "modelId" INTEGER,
ADD COLUMN     "receptionStatus" TEXT NOT NULL,
ADD COLUMN     "serialNumber" TEXT,
ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Purchases" DROP COLUMN "totalCost",
ADD COLUMN     "deliveryDate" TIMESTAMP(3),
ADD COLUMN     "deliveryEstimate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "notes" TEXT NOT NULL,
ADD COLUMN     "paymentTerm" TEXT NOT NULL,
ADD COLUMN     "purchaseDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "purchaseOrder" TEXT NOT NULL,
ADD COLUMN     "purchaseStatus" TEXT NOT NULL,
ADD COLUMN     "receiptMethod" TEXT NOT NULL,
ADD COLUMN     "reference" TEXT NOT NULL,
ADD COLUMN     "shipmentPreference" TEXT NOT NULL,
ADD COLUMN     "termsConditions" TEXT NOT NULL,
ADD COLUMN     "totalPurchase" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "urlAttachments" TEXT[];

-- AddForeignKey
ALTER TABLE "PurchaseDetails" ADD CONSTRAINT "PurchaseDetails_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDetails" ADD CONSTRAINT "PurchaseDetails_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Models"("modelId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseDetails" ADD CONSTRAINT "PurchaseDetails_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Colors"("colorId") ON DELETE SET NULL ON UPDATE CASCADE;
