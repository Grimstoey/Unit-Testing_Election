import { findAllConstituenciesService } from '@/services/AdminService'
import type { Request, Response } from 'express'

export async function findAllConstituenciesController(
  req: Request,
  res: Response,
) {
  const result = await findAllConstituenciesService()

  if (!result.ok) {
    return res.status(result.status).json({ message: result.message })
  }

  return res.status(200).json(result.data)
}
