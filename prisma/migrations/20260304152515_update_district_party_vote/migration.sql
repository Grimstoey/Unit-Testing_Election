/*
  Warnings:

  - You are about to drop the column `constituencyId` on the `vote` table. All the data in the column will be lost.
  - You are about to drop the `districtInConstituency` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `constituencyId` to the `district` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `party` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `party` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `party` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "districtInConstituency" DROP CONSTRAINT "districtInConstituency_constituencyId_fkey";

-- DropForeignKey
ALTER TABLE "districtInConstituency" DROP CONSTRAINT "districtInConstituency_districtId_fkey";

-- DropForeignKey
ALTER TABLE "vote" DROP CONSTRAINT "vote_constituencyId_fkey";

-- AlterTable
ALTER TABLE "district" ADD COLUMN     "constituencyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "party" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "vote" DROP COLUMN "constituencyId",
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropTable
DROP TABLE "districtInConstituency";

-- AddForeignKey
ALTER TABLE "district" ADD CONSTRAINT "district_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "constituency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
