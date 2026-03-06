import { seedUser, seedVote } from '../src/db'
import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('🚀 Running mock data generation (Users + Votes)...')

  await seedUser()
  await seedVote()

  console.log('✅ Mock data generation completed')
}

main()
  .catch((e) => {
    console.error('❌ Mock data generation failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
