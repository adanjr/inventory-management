/*
  Warnings:

  - You are about to drop the column `productId` on the `Movements` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `Movements` table. All the data in the column will be lost.
  - Added the required column `approved` to the `Movements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Movements" DROP CONSTRAINT "Movements_fromLocationId_fkey";

-- DropForeignKey
ALTER TABLE "Movements" DROP CONSTRAINT "Movements_productId_fkey";

-- DropForeignKey
ALTER TABLE "Movements" DROP CONSTRAINT "Movements_toLocationId_fkey";

-- DropForeignKey
ALTER TABLE "Movements" DROP CONSTRAINT "Movements_vehicleId_fkey";

-- AlterTable
ALTER TABLE "Movements" DROP COLUMN "productId",
DROP COLUMN "vehicleId",
ADD COLUMN     "approved" BOOLEAN NOT NULL,
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "orderReference" TEXT,
ALTER COLUMN "fromLocationId" DROP NOT NULL,
ALTER COLUMN "toLocationId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "MovementDetail" (
    "movementDetailId" SERIAL NOT NULL,
    "movementId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "productId" INTEGER,
    "inspectionStatus" TEXT NOT NULL,

    CONSTRAINT "MovementDetail_pkey" PRIMARY KEY ("movementDetailId")
);

-- AddForeignKey
ALTER TABLE "Movements" ADD CONSTRAINT "Movements_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES "Locations"("locationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movements" ADD CONSTRAINT "Movements_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES "Locations"("locationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovementDetail" ADD CONSTRAINT "MovementDetail_movementId_fkey" FOREIGN KEY ("movementId") REFERENCES "Movements"("movementId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovementDetail" ADD CONSTRAINT "MovementDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("productId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovementDetail" ADD CONSTRAINT "MovementDetail_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("vehicleId") ON DELETE RESTRICT ON UPDATE CASCADE;
