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

export const createVoteRepository = async (vote: VoteDto) => {
  const result = await prisma.vote.create({ data: vote })
  return result
}

export const updateVoteRepository = async (vote: VoteDto) => {
  const result = await prisma.vote.update({
    where: { userId: vote.userId },
    data: vote,
  })
  return result
}
