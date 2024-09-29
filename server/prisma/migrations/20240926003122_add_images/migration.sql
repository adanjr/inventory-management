-- AlterTable
ALTER TABLE "Customers" ADD COLUMN     "mainImageUrl" TEXT;

-- AlterTable
ALTER TABLE "Locations" ADD COLUMN     "additionalImages" TEXT[],
ADD COLUMN     "mainImageUrl" TEXT;

-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "additionalImages" TEXT[],
ADD COLUMN     "mainImageUrl" TEXT;

-- AlterTable
ALTER TABLE "Suppliers" ADD COLUMN     "mainImageUrl" TEXT;

-- AlterTable
ALTER TABLE "Units" ADD COLUMN     "additionalImages" TEXT[],
ADD COLUMN     "mainImageUrl" TEXT;
