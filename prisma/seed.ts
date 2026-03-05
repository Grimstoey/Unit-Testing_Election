import { prisma } from '../src/lib/prisma'

import {
  seedRole,
  seedProvince,
  seedConstituency,
  seedDistrict,
  seedParty,
  seedCandidate,
} from '../src/db'

async function main() {
  console.log("🚀 Start seeding...")

  await seedRole()

  await seedProvince()

  await seedConstituency()

  await seedDistrict()

  await seedParty()

  await seedCandidate()

  console.log("✅ Seeding completed successfully")
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })