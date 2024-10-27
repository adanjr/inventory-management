/*
  Warnings:

  - The primary key for the `Roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `roleId` column on the `Roles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - Changed the type of `roleId` on the `RolePermission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roleId` on the `UserRole` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- AlterTable
ALTER TABLE "RolePermission" DROP COLUMN "roleId",
ADD COLUMN     "roleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Roles" DROP CONSTRAINT "Roles_pkey",
DROP COLUMN "roleId",
ADD COLUMN     "roleId" SERIAL NOT NULL,
ADD CONSTRAINT "Roles_pkey" PRIMARY KEY ("roleId");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "roleId" INTEGER;

-- AlterTable
ALTER TABLE "UserRole" DROP COLUMN "roleId",
ADD COLUMN     "roleId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("roleId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;
