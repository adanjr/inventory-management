/*
  Warnings:

  - The primary key for the `PurchaseSummary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SalesSummary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[purchaseSummaryId]` on the table `PurchaseSummary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[salesSummaryId]` on the table `SalesSummary` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PurchaseSummary" DROP CONSTRAINT "PurchaseSummary_pkey";

-- AlterTable
ALTER TABLE "SalesSummary" DROP CONSTRAINT "SalesSummary_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseSummary_purchaseSummaryId_key" ON "PurchaseSummary"("purchaseSummaryId");

-- CreateIndex
CREATE UNIQUE INDEX "SalesSummary_salesSummaryId_key" ON "SalesSummary"("salesSummaryId");
