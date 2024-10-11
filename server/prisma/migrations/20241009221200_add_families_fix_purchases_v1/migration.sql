/*
  Warnings:

  - You are about to drop the column `quantity` on the `Purchases` table. All the data in the column will be lost.
  - You are about to drop the column `unitCost` on the `Purchases` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InventoryLocations" ADD COLUMN     "maximumStockLevel" INTEGER,
ADD COLUMN     "minimumStockLevel" INTEGER,
ADD COLUMN     "reorderPoint" INTEGER;

-- AlterTable
ALTER TABLE "Models" ADD COLUMN     "familyId" INTEGER,
ADD COLUMN     "rating" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "productCode" TEXT,
ADD COLUMN     "reorderQuantity" INTEGER;

-- AlterTable
ALTER TABLE "PurchaseDetails" ADD COLUMN     "actualDate" TIMESTAMP(3),
ADD COLUMN     "expectedDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Purchases" DROP COLUMN "quantity",
DROP COLUMN "unitCost";

-- CreateTable
CREATE TABLE "Families" (
    "familyId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" INTEGER NOT NULL,
    "year_start" TEXT,
    "year_end" TEXT,
    "makeId" INTEGER NOT NULL,

    CONSTRAINT "Families_pkey" PRIMARY KEY ("familyId")
);

-- AddForeignKey
ALTER TABLE "Models" ADD CONSTRAINT "Models_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Families"("familyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Families" ADD CONSTRAINT "Families_makeId_fkey" FOREIGN KEY ("makeId") REFERENCES "Makes"("makeId") ON DELETE RESTRICT ON UPDATE CASCADE;
