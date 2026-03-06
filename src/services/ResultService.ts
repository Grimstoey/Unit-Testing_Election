import { PartyStats } from '@/models/result/resultDto'
import { prisma } from '../lib/prisma'

export const getElectionDashboard = async () => {
  const [totalVotes, totalUsers, totalConstituencies, closedConstituencies] =
    await Promise.all([
      prisma.vote.count(),
      prisma.user.count({
        where: { roles: { some: { role: { name: 'ROLE_VOTER' } } } },
      }),
      prisma.constituency.count(),
      prisma.constituency.count({ where: { isClosed: true } }),
    ])

  const turnout = totalUsers > 0 ? (totalVotes / totalUsers) * 100 : 0
  const countingProgress =
    totalConstituencies > 0
      ? (closedConstituencies / totalConstituencies) * 100
      : 0

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
