/*
  Warnings:

  - You are about to drop the column `locationId` on the `Products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_locationId_fkey";

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "locationId";
