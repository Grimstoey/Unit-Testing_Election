import { prisma } from '../lib/prisma'
import { VoteDto } from '../models/vote/voteDto'

export const getCandidatesRepository = async (constituencyId: number) => {
  const candidates = await prisma.candidate.findMany({
    where: { constituencyId },
    include: {
      constituency: {
        include: {
          province: true,
        },
      },
      party: true,
    },
  })
  return candidates
}

export const getCandidateInConstituencyRepository = async (
  constituencyId: number,
  candidateId: number,
) => {
  const candidate = await prisma.candidate.findFirst({
    where: { constituencyId, id: candidateId },
  })
  return candidate
}

export const createVoteRepository = async (vote: VoteDto) => {
  try {
    const result = await prisma.vote.create({ data: vote })
    return result
  } catch (error) {
    console.log(error)
    return null
  }
}

export const updateVoteRepository = async (vote: VoteDto) => {
  try {
    const result = await prisma.vote.update({
      where: { userId: vote.userId },
      data: vote,
    })
    return result
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getMyVoteRepository = async (userId: number) => {
  const result = await prisma.vote.findFirst({
    where: { userId },
  })
  return result
}
