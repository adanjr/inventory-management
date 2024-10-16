-- AlterTable
ALTER TABLE "Colors" ADD COLUMN     "hexadecimal" TEXT;

-- AlterTable
ALTER TABLE "Purchases" ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP;
