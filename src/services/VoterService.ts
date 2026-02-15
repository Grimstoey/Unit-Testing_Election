import { VoteDto } from '@/models/vote/voteDto'
import {
  getCandidatesRepository,
  createVoteRepository,
  updateVoteRepository,
  getCandidateInConstituencyRepository,
  getMyVoteRepository,
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
  if (!result) {
    return {
      ok: false as const,
      status: 400,
      message: 'Failed to create vote',
    }
  }
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

export const checkCandidateInConstituencyService = async (
  constituencyId: number,
  candidateId: number,
) => {
  const result = await getCandidateInConstituencyRepository(
    constituencyId,
    candidateId,
  )
  return result
}

export const getMyVoteService = async (userId: number) => {
  const result = await getMyVoteRepository(userId)
  if (!result) {
    return {
      ok: false as const,
      status: 404,
      message: 'Vote not found',
    }
  }
  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}
