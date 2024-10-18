-- AlterTable
ALTER TABLE "Movements" ADD COLUMN     "arrivalDate" TIMESTAMP(3),
ADD COLUMN     "isReceived" BOOLEAN,
ADD COLUMN     "receivedBy" TEXT,
ADD COLUMN     "receptionNotes" TEXT;
