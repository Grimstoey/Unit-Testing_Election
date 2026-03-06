import { prisma } from '../lib/prisma'

export async function seedVote() {
  console.log('🗳️ Seeding votes...')

  // 1. Fetch all users and candidates
  const [users, candidates] = await Promise.all([
    prisma.user.findMany(),
    prisma.candidate.findMany(),
  ])

  if (!users.length || !candidates.length) {
    console.warn('⚠️ No users or candidates found. Skipping vote seeding.')
    return
  }

  // 2. Fetch existing votes to avoid duplicate userId
  const existingVotes = await prisma.vote.findMany({
    select: { userId: true },
  })
  const votedUserIds = new Set(existingVotes.map((v) => v.userId))

  const newVotes = []

  for (const user of users) {
    // Check if user already voted
    if (votedUserIds.has(user.id)) continue

    // Random choice: 80% chance that this user will vote
    if (Math.random() > 0.2) {
      // Pick a random candidate
      const randomCandidate =
        candidates[Math.floor(Math.random() * candidates.length)]

      newVotes.push({
        userId: user.id,
        candidateId: randomCandidate.id,
      })
    }
  }

  if (newVotes.length > 0) {
    const result = await prisma.vote.createMany({
      data: newVotes,
      skipDuplicates: true,
    })
    console.log(`--->>> Seed completed: inserted ${result.count} new votes`)
  } else {
    console.log('--->>> No new votes to seed')
  }
}
