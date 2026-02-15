import { constituency } from '@/generated/prisma/client'
import { VoteDto } from '@/models/vote/voteDto'
import {
  getCandidatesRepository,
  createVoteRepository,
  updateVoteRepository,
  getCandidateInConstituencyRepository,
  getMyVoteRepository,
  getConstituencyRepository,
} from '@/repositories/VoterRepository'

// ดึงข้อมูลผู้สมัครในเขต
export const getCandidatesService = async (constituencyId: number) => {
  const result = await getCandidatesRepository(constituencyId)

  if (!result) {
    return {
      ok: false as const,
      status: 404, // Not Found
      message: 'Candidates not found',
    }
  }

  return {
    ok: true as const,
    status: 200,
    data: result,
  }
}

// ฟังก์ชันโหวต
export const createVoteService = async (vote: VoteDto) => {
  const validationError = await validateVote(vote)
  if (validationError) return validationError

  const result = await createVoteRepository(vote)
  return result
}

// ฟังก์ชันแก้ไขโหวต
export const updateVoteService = async (vote: VoteDto) => {
  const validationError = await validateVote(vote)
  if (validationError) return validationError

  const result = await updateVoteRepository(vote)
  return result
}

// ฟังก์ชันตรวจสอบเงื่อนไขก่อนโหวต
const validateVote = async (vote: VoteDto) => {
  if (!vote?.candidateId) {
    return {
      ok: false as const,
      status: 400,
      message: 'Missing candidateId',
    }
  }

  const constituencyId = Number(vote?.constituencyId)
  const candidateId = Number(vote?.candidateId)

  // 1. เช็คว่าเขตปิดยัง
  const isClosed = (
    (await getConstituencyRepository(constituencyId)) as constituency
  )?.isClosed
  if (isClosed) {
    return {
      ok: false as const,
      status: 400,
      message: 'Constituency is closed',
    }
  }

  // 2. เช็คผู้สมัคร
  const isCandidateValid = await getCandidateInConstituencyRepository(
    constituencyId,
    candidateId,
  )

  if (!isCandidateValid) {
    return {
      ok: false as const,
      status: 400,
      message: 'Candidate not found in constituency',
    }
  }

  return null
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
