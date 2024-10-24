-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "rfc" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "purchaseOrderPrefix" TEXT NOT NULL,
    "saleOrderPrefix" TEXT NOT NULL,
    "invoicePrefix" TEXT NOT NULL,
    "startingOrderNumber" INTEGER NOT NULL,
    "startingInvoiceNumber" INTEGER NOT NULL,
    "startingPurchaseOrderNumber" INTEGER NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);
