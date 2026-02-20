import {
  getAllProvincesService,
  getConstituenciesByDistrictIdService,
  getDistrictsByProvinceIdService,
} from '@/services/LocationService'
import type { Request, Response } from 'express'

export async function getAllProvincesController(req: Request, res: Response) {
  const result = await getAllProvincesService()

  if (!result.ok) {
    return res.status(result.status).json({ message: result.message })
  }

  return res.status(200).json(result.data)
}

export async function getDistrictsByProvinceIdController(
  req: Request,
  res: Response,
) {
  const provinceId = req?.params?.provinceId
  if (!provinceId) {
    return res.status(400).json({ message: 'Province ID is required' })
  }
  if (isNaN(Number(provinceId))) {
    return res.status(400).json({ message: 'Province ID must be a number' })
  }

  const result = await getDistrictsByProvinceIdService(Number(provinceId))

  if (!result.ok) {
    return res.status(result.status).json({ message: result.message })
  }

  return res.status(200).json(result.data)
}

export async function getConstituenciesByDistrictIdController(
  req: Request,
  res: Response,
) {
  const districtId = req?.params?.districtId

  if (!districtId) {
    return res.status(400).json({ message: 'District ID is required' })
  }
  if (isNaN(Number(districtId))) {
    return res.status(400).json({ message: 'District ID must be a number' })
  }

  const result = await getConstituenciesByDistrictIdService(Number(districtId))

  if (!result.ok) {
    return res.status(result.status).json({ message: result.message })
  }

  return res.status(200).json(result.data)
}
