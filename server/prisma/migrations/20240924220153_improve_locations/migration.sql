/*
  Warnings:

  - You are about to drop the column `manager` on the `Locations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Locations" DROP COLUMN "manager",
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "managerId" TEXT;

-- AddForeignKey
ALTER TABLE "Locations" ADD CONSTRAINT "Locations_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
