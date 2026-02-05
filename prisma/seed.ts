import { prisma } from '../src/lib/prisma'

import {
  seedRole,
  seedProvince,
  seedDistrict,
  seedConstituency,
  seedDistrictInConstituency,
  seedParty,
  seedCandidate,
} from '../src/db'

async function main() {
  await seedRole()
  await seedProvince()
  await seedDistrict()
  await seedConstituency()
  await seedDistrictInConstituency()
  await seedParty()
  await seedCandidate()
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
