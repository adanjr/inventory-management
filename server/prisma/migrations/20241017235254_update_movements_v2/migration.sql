-- DropForeignKey
ALTER TABLE "MovementDetail" DROP CONSTRAINT "MovementDetail_vehicleId_fkey";

-- AlterTable
ALTER TABLE "MovementDetail" ALTER COLUMN "vehicleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MovementDetail" ADD CONSTRAINT "MovementDetail_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicles"("vehicleId") ON DELETE SET NULL ON UPDATE CASCADE;
