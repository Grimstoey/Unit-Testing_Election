-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "citizenId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "provinceId" INTEGER NOT NULL,
    "areaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "electionDistrictId" INTEGER,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userRole" (
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "userRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "province" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districtArea" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "provinceId" INTEGER NOT NULL,

    CONSTRAINT "districtArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "electionDistrict" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "provinceId" INTEGER NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "electionDistrict_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districtAreaOnElectionDistrict" (
    "districtAreaId" INTEGER NOT NULL,
    "electionDistrictId" INTEGER NOT NULL,

    CONSTRAINT "districtAreaOnElectionDistrict_pkey" PRIMARY KEY ("districtAreaId","electionDistrictId")
);

-- CreateTable
CREATE TABLE "party" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "policy" TEXT NOT NULL,

    CONSTRAINT "party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "partyId" INTEGER NOT NULL,
    "districtId" INTEGER NOT NULL,

    CONSTRAINT "candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vote" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_citizenId_key" ON "user"("citizenId");

-- CreateIndex
CREATE INDEX "user_provinceId_areaId_idx" ON "user"("provinceId", "areaId");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "province_name_key" ON "province"("name");

-- CreateIndex
CREATE UNIQUE INDEX "districtArea_name_provinceId_key" ON "districtArea"("name", "provinceId");

-- CreateIndex
CREATE UNIQUE INDEX "electionDistrict_provinceId_number_key" ON "electionDistrict"("provinceId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "party_name_key" ON "party"("name");

-- CreateIndex
CREATE UNIQUE INDEX "candidate_number_districtId_key" ON "candidate"("number", "districtId");

-- CreateIndex
CREATE UNIQUE INDEX "vote_userId_key" ON "vote"("userId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "districtArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_electionDistrictId_fkey" FOREIGN KEY ("electionDistrictId") REFERENCES "electionDistrict"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userRole" ADD CONSTRAINT "userRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userRole" ADD CONSTRAINT "userRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districtArea" ADD CONSTRAINT "districtArea_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "electionDistrict" ADD CONSTRAINT "electionDistrict_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districtAreaOnElectionDistrict" ADD CONSTRAINT "districtAreaOnElectionDistrict_districtAreaId_fkey" FOREIGN KEY ("districtAreaId") REFERENCES "districtArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districtAreaOnElectionDistrict" ADD CONSTRAINT "districtAreaOnElectionDistrict_electionDistrictId_fkey" FOREIGN KEY ("electionDistrictId") REFERENCES "electionDistrict"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate" ADD CONSTRAINT "candidate_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "electionDistrict"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
