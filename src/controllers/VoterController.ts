import type { Request, Response } from 'express'
import {
  getCandidatesService,
  createVoteService,
  updateVoteService,
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
  const { constituency } = user?.data
  const { candidateId } = req.body
  if (!constituency?.id || !candidateId) {
    return res.status(400).json('Missing constituencyId or candidateId')
  }

  const result = await createVoteService({
    userId: user.id,
    constituencyId: Number(constituency.id),
    candidateId: Number(candidateId),
  })
  return res.status(200).json(result)
}

export async function updateVoteController(req: Request, res: Response) {
  const { user } = req.body
  const { constituency } = user?.data
  const { candidateId } = req.body
  if (!constituency?.id || !candidateId) {
    return res.status(400).json('Missing constituencyId or candidateId')
  }

  const result = await updateVoteService({
    userId: user.id,
    constituencyId: Number(constituency.id),
    candidateId: Number(candidateId),
  })

  return res.status(200).json(result)
}

export async function getMyVoteController(req: Request, res: Response) {}
