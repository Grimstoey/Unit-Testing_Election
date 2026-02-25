/*
  Warnings:

  - You are about to drop the column `fullName` on the `candidate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[partyId,constituencyId]` on the table `candidate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `candidate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "candidate" DROP COLUMN "fullName",
ADD COLUMN     "candidatePolicy" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "candidate_partyId_constituencyId_key" ON "candidate"("partyId", "constituencyId");
