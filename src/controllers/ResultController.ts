import { Request, Response } from 'express'
import {
  getElectionResult,
  getProvincesWithConstituenciesService,
  getResultByConstituencieIdService,
} from '../services/ResultService'

export const getResults = async (req: Request, res: Response) => {
  const result = await getElectionResult()
  return res.status(200).json({
    ok: true as const,
    status: 200,
    message: 'Get election dashboard successfully',
    data: result,
  })
}

export const getProvincesWithConstituenciesController = async (
  req: Request,
  res: Response,
) => {
  const result = await getProvincesWithConstituenciesService()
  return res.status(200).json({
    ok: true as const,
    status: 200,
    message: 'Get constituencies successfully',
    data: result,
  })
}

export const getResultByConstituencieIdController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params
  if (!id) {
    return res.status(400).json({
      ok: false as const,
      status: 400,
      message: 'Missing constituency id',
    })
  }
  if (isNaN(Number(id))) {
    return res.status(400).json({
      ok: false as const,
      status: 400,
      message: 'Constituency id is not a number',
    })
  }
  const result = await getResultByConstituencieIdService(Number(id))
  return res.status(200).json({
    ok: true as const,
    status: 200,
    message: 'Get constituencies result successfully',
    data: result,
  })
}
