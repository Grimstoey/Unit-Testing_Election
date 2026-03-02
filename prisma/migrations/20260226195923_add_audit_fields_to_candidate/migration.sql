/*
  Warnings:

  - A unique constraint covering the columns `[citizenId]` on the table `candidate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `citizenId` to the `candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `candidate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "candidate" ADD COLUMN     "citizenId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedBy" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "candidate_citizenId_key" ON "candidate"("citizenId");
