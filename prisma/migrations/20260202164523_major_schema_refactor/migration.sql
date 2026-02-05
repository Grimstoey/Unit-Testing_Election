/*
  Warnings:

  - You are about to drop the column `districtId` on the `candidate` table. All the data in the column will be lost.
  - You are about to drop the column `areaId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `electionDistrictId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `districtArea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `districtAreaOnElectionDistrict` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `electionDistrict` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[number,constituencyId]` on the table `candidate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `constituencyId` to the `candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `districtId` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `constituencyId` to the `vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "candidate" DROP CONSTRAINT "candidate_districtId_fkey";

-- DropForeignKey
ALTER TABLE "districtArea" DROP CONSTRAINT "districtArea_provinceId_fkey";

-- DropForeignKey
ALTER TABLE "districtAreaOnElectionDistrict" DROP CONSTRAINT "districtAreaOnElectionDistrict_districtAreaId_fkey";

-- DropForeignKey
ALTER TABLE "districtAreaOnElectionDistrict" DROP CONSTRAINT "districtAreaOnElectionDistrict_electionDistrictId_fkey";

-- DropForeignKey
ALTER TABLE "electionDistrict" DROP CONSTRAINT "electionDistrict_provinceId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_areaId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_electionDistrictId_fkey";

-- DropIndex
DROP INDEX "candidate_number_districtId_key";

-- DropIndex
DROP INDEX "user_provinceId_areaId_idx";

-- AlterTable
ALTER TABLE "candidate" DROP COLUMN "districtId",
ADD COLUMN     "constituencyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "areaId",
DROP COLUMN "electionDistrictId",
ADD COLUMN     "constituencyId" INTEGER,
ADD COLUMN     "districtId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "vote" ADD COLUMN     "constituencyId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "districtArea";

-- DropTable
DROP TABLE "districtAreaOnElectionDistrict";

-- DropTable
DROP TABLE "electionDistrict";

-- CreateTable
CREATE TABLE "district" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "provinceId" INTEGER NOT NULL,

    CONSTRAINT "district_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "constituency" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "provinceId" INTEGER NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "constituency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districtInConstituency" (
    "districtId" INTEGER NOT NULL,
    "constituencyId" INTEGER NOT NULL,

    CONSTRAINT "districtInConstituency_pkey" PRIMARY KEY ("districtId","constituencyId")
);

-- CreateIndex
CREATE UNIQUE INDEX "district_name_provinceId_key" ON "district"("name", "provinceId");

-- CreateIndex
CREATE UNIQUE INDEX "constituency_provinceId_number_key" ON "constituency"("provinceId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "candidate_number_constituencyId_key" ON "candidate"("number", "constituencyId");

-- CreateIndex
CREATE INDEX "user_provinceId_districtId_idx" ON "user"("provinceId", "districtId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "constituency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "district" ADD CONSTRAINT "district_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "constituency" ADD CONSTRAINT "constituency_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districtInConstituency" ADD CONSTRAINT "districtInConstituency_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districtInConstituency" ADD CONSTRAINT "districtInConstituency_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "constituency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "constituency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "constituency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
