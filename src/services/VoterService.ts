import { VoteDto } from '@/models/vote/voteDto'
import {
  getCandidatesRepository,
  createVoteRepository,
  updateVoteRepository,
} from '@/repositories/VoterRepository'

export const getCandidatesService = async (constituencyId: number) => {
  const result = await getCandidatesRepository(constituencyId)

  if (!result) {
    return {
      ok: false as const,
      status: 404,
      message: 'Candidates not found',
    }
  }

  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}

export const createVoteService = async (vote: VoteDto) => {
  const result = await createVoteRepository(vote)

  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}

export const updateVoteService = async (vote: VoteDto) => {
  const result = await updateVoteRepository(vote)

  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}
