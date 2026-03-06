import { Request, Response } from 'express'
import { getElectionDashboard } from '../services/ResultService'

export const getResults = async (req: Request, res: Response) => {
  const result = await getElectionDashboard()
  return res.status(200).json({
    ok: true as const,
    status: 200,
    message: 'Get election dashboard successfully',
    data: result,
  })
}
