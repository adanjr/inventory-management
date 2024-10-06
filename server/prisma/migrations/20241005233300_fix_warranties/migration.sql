/*
  Warnings:

  - The primary key for the `Warranty` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `warrantyId` column on the `Warranty` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `warrantyId` on the `Vehicles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Vehicles" DROP CONSTRAINT "Vehicles_warrantyId_fkey";

-- AlterTable
ALTER TABLE "Vehicles" DROP COLUMN "warrantyId",
ADD COLUMN     "warrantyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Warranty" DROP CONSTRAINT "Warranty_pkey",
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Garantia',
DROP COLUMN "warrantyId",
ADD COLUMN     "warrantyId" SERIAL NOT NULL,
ADD CONSTRAINT "Warranty_pkey" PRIMARY KEY ("warrantyId");

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_warrantyId_fkey" FOREIGN KEY ("warrantyId") REFERENCES "Warranty"("warrantyId") ON DELETE RESTRICT ON UPDATE CASCADE;
