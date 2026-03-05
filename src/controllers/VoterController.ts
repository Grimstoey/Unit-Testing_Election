import type { Request, Response } from 'express'
import {
  getCandidatesService,
  createVoteService,
  updateVoteService,
  getMyVoteService,
  getConstituencyService,
} from '../services/VoterService'

export async function getCandidatesController(req: Request, res: Response) {
  const { user } = req.body
  const { constituency } = user
  if (!constituency?.id) {
    return res.status(400)
  }

  const result = await getCandidatesService(Number(constituency.id))

  return res.status(200).json(result)
}

export async function getConstituencyController(req: Request, res: Response) {
  const { user } = req.body
  const { constituency } = user
  if (!constituency?.id) {
    return res.status(400)
  }

  const result = await getConstituencyService(Number(constituency.id))

  return res.status(200).json(result)
}

export async function createVoteController(req: Request, res: Response) {
  const { user } = req.body
  const userId = user?.id
  const { candidateId } = req.body

  const result = await createVoteService({
    userId: Number(userId),
    candidateId: Number(candidateId),
  })

  if (!result) {
    return res.status(400).json({
      ok: false as const,
      status: 400,
      message: 'Failed to create vote',
    })
  }

  return res.status(200).json(result)
}

export async function updateVoteController(req: Request, res: Response) {
  const { user } = req.body
  const userId = user?.id
  const { candidateId } = req.body

  if (!userId || !candidateId) {
    return res.status(400).json({
      ok: false,
      status: 400,
      message: 'Missing userId or candidateId',
    })
  }

  const result = await updateVoteService({
    userId: Number(userId),
    candidateId: Number(candidateId),
  })

  if (!result) {
    return res.status(400).json({
      ok: false as const,
      status: 400,
      message: 'Failed to update vote',
    })
  }

  return res.status(200).json(result)
}

export async function getMyVoteController(req: Request, res: Response) {
  const { user } = req.body
  const userId = user?.id
  const result = await getMyVoteService(Number(userId))
  return res.status(200).json(result)
}
