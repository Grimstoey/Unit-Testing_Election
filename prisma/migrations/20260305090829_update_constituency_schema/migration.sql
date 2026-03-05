-- DropForeignKey
ALTER TABLE "district" DROP CONSTRAINT "district_constituencyId_fkey";

-- AlterTable
ALTER TABLE "district" ALTER COLUMN "constituencyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "district" ADD CONSTRAINT "district_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "constituency"("id") ON DELETE SET NULL ON UPDATE CASCADE;
