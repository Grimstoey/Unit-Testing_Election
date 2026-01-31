import prisma from "../src/lib/prisma";

import {
    seedRole,
    seedProvince,
    seedDistrictArea,
    seedElectionDistrict,
    seedDistrictAreaMapping,
    seedParty,
    seedCandidate,
} from "../src/db";

async function main() {
    await seedRole();
    await seedProvince();
    await seedDistrictArea();
    await seedElectionDistrict();
    await seedDistrictAreaMapping();
    await seedParty();
    await seedCandidate();
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
