/*
  Warnings:

  - You are about to drop the column `quantity` on the `Sales` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `Sales` table. All the data in the column will be lost.
  - Added the required column `compraOnline` to the `Sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enviarADomicilio` to the `Sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recogerEnTieda` to the `Sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SaleDetails" ADD COLUMN     "assemblyAndConfigurationCost" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Sales" DROP COLUMN "quantity",
DROP COLUMN "unitPrice",
ADD COLUMN     "compraOnline" BOOLEAN NOT NULL,
ADD COLUMN     "enviarADomicilio" BOOLEAN NOT NULL,
ADD COLUMN     "locationId" INTEGER,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "recogerEnTieda" BOOLEAN NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("locationId") ON DELETE SET NULL ON UPDATE CASCADE;
