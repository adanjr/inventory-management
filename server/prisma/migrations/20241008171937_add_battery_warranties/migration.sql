/*
  Warnings:

  - You are about to drop the column `batteryDuration` on the `Warranty` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Models" ADD COLUMN     "additionalImages" TEXT[],
ADD COLUMN     "mainImageUrl" TEXT;

-- AlterTable
ALTER TABLE "Vehicles" ADD COLUMN     "batteryWarrantyId" INTEGER;

-- AlterTable
ALTER TABLE "Warranty" DROP COLUMN "batteryDuration";

-- CreateTable
CREATE TABLE "BatteryWarranty" (
    "batteryWarrantyId" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Garantia',
    "durationMonths" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "BatteryWarranty_pkey" PRIMARY KEY ("batteryWarrantyId")
);

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_batteryWarrantyId_fkey" FOREIGN KEY ("batteryWarrantyId") REFERENCES "BatteryWarranty"("batteryWarrantyId") ON DELETE SET NULL ON UPDATE CASCADE;
