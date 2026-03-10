import { PartyStats } from '@/models/result/resultDto'
import { prisma } from '../lib/prisma'
import { getProvincesWithConstituenciesRepository } from '@/repositories/LocationRepository'
import { getResultByConstituencieIdRepository } from '@/repositories/ConstituenciesRepository'

const getCountingProgress = async () => {
  const totalConstituencies = await prisma.constituency.count()
  const closedConstituencies = await prisma.constituency.count({
    where: { isClosed: true },
  })
  return totalConstituencies > 0
    ? (closedConstituencies / totalConstituencies) * 100
    : 0
}

export const getElectionResult = async () => {
  const [totalVotes, totalUsers, countingProgress] = await Promise.all([
    prisma.vote.count(),
    prisma.user.count({
      where: { roles: { some: { role: { name: 'ROLE_VOTER' } } } },
    }),
    getCountingProgress(),
  ])

  const turnout = totalUsers > 0 ? (totalVotes / totalUsers) * 100 : 0

  const constituencies = await prisma.constituency.findMany({
    include: {
      candidates: {
        include: {
          _count: { select: { votes: true } },
          party: {
            select: { id: true, name: true, logoUrl: true },
          },
        },
      },
    },
  })

  // ข้อมูลพรรค
  const partyData: Record<number, PartyStats> = {}

  const allParties = await prisma.party.findMany({
    select: { id: true, name: true, logoUrl: true },
  })

  allParties.forEach((p) => {
    partyData[p.id] = { ...p, seats: 0 }
  })

  // หาผู้ชนะในแต่ละเขต
  constituencies.forEach((c) => {
    if (c.candidates.length === 0) return

    let maxVotes = -1
    let winners: typeof c.candidates = []

    c.candidates.forEach((cand) => {
      const votes = cand._count.votes
      if (votes > maxVotes) {
        maxVotes = votes
        winners = [cand]
      } else if (votes === maxVotes && votes > 0) {
        winners.push(cand)
      }
    })

    // ถ้าเสมอกันให้ถือว่าไม่มีผู้ชนะ
    if (winners.length === 1 && maxVotes > 0) {
      const winner = winners[0]
      if (partyData[winner.partyId]) {
        partyData[winner.partyId].seats++
      }
    }
  })

  const partyStats = Object.values(partyData).sort((a, b) => b.seats - a.seats)

  return {
    totalVotes,
    turnout: Number(turnout.toFixed(2)), // % จำนวนผู้ออกมาใช้สิทธิ์
    countingProgress: Number(countingProgress.toFixed(2)), // % ของเขตที่ปิดหีบแล้ว
    partyStats,
    updateAt: new Date(),
  }
}

export const getProvincesWithConstituenciesService = async () => {
  const [result, countingProgress] = await Promise.all([
    getProvincesWithConstituenciesRepository(),
    getCountingProgress(),
  ])

  return {
    provinces: result,
    updateAt: new Date(),
    countingProgress: Number(countingProgress.toFixed(2)), // % ของเขตที่ปิดหีบแล้ว
  }
}

export const getResultByConstituencieIdService = async (id: number) => {
  const result = await getResultByConstituencieIdRepository(id)
  return {
    ...result,
    candidates: result?.candidates?.map((c) => ({
      id: c.id,
      fullName: c.firstName + ' ' + c.lastName,
      candidatePolicy: c.candidatePolicy,
      number: c.number,
      imageUrl: c.imageUrl,
      party: c.party,
      votes: c._count.votes,
    })),
  }
}
