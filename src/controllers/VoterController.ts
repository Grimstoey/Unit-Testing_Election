import type { Request, Response } from 'express'
import {
  getCandidatesService,
  createVoteService,
  updateVoteService,
  checkCandidateInConstituencyService,
  getMyVoteService,
} from '../services/VoterService'

export async function getCandidatesController(req: Request, res: Response) {
  const { user } = req.body
  const { constituency } = user?.data
  if (!constituency?.id) {
    return res.status(400)
  }

  const result = await getCandidatesService(Number(constituency.id))

  return res.status(200).json(result)
}

export async function createVoteController(req: Request, res: Response) {
  const { user } = req.body
  const userId = user?.data?.id
  const { constituency } = user?.data
  const { candidateId } = req.body

  if (!candidateId) {
    return res.status(400).json({
      ok: false as const,
      status: 400,
      message: 'Missing candidateId',
    })
  }
  const checkCandidateInConstituency =
    await checkCandidateInConstituencyService(
      Number(constituency.id),
      Number(candidateId),
    )

  if (!checkCandidateInConstituency) {
    return res.status(400).json({
      ok: false as const,
      status: 400,
      message: 'Candidate not found in constituency',
    })
  }

  const result = await createVoteService({
    userId: Number(userId),
    constituencyId: Number(constituency.id),
    candidateId: Number(candidateId),
  })

  return res.status(200).json(result)
}

export async function updateVoteController(req: Request, res: Response) {
  const { user } = req.body
  const userId = user?.data?.id
  const { constituency } = user?.data
  const { candidateId } = req.body

  if (!candidateId) {
    return res.status(400).json({
      ok: false as const,
      status: 400,
      message: 'Missing candidateId',
    })
  }
  const checkCandidateInConstituency =
    await checkCandidateInConstituencyService(
      Number(constituency.id),
      Number(candidateId),
    )

  if (!checkCandidateInConstituency) {
    return res.status(400).json({
      ok: false as const,
      status: 400,
      message: 'Candidate not found in constituency',
    })
  }

  const result = await updateVoteService({
    userId: Number(userId),
    constituencyId: Number(constituency.id),
    candidateId: Number(candidateId),
  })

  return res.status(200).json(result)
}

export async function getMyVoteController(req: Request, res: Response) {
  const { user } = req.body
  const userId = user?.data?.id
  const result = await getMyVoteService(Number(userId))
  return res.status(200).json(result)
}
