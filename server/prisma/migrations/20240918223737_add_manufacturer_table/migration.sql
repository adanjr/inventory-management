-- CreateTable
CREATE TABLE "Manufacturer" (
    "manufacturer_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "contact_info" TEXT,

    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("manufacturer_id")
);
