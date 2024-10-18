-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_locationId_fkey";

-- AlterTable
ALTER TABLE "Vehicles" ALTER COLUMN "locationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("locationId") ON DELETE SET NULL ON UPDATE CASCADE;
