import {
  closeAllConstituenciesService,
  createConstituencyService,
  deleteConstituencyService,
  editConstituencyService,
  findAllConstituenciesService,
  getAllConstituencyWithPagination,
  getAvailableDistrictByProvinceIdService,
  openAllConstituenciesService,
  toggleConstituencyService,
} from '@/services/ConstituencyService'
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

export async function createConstituencyController(
  req: Request,
  res: Response,
) {
  const { number, provinceId, districtIds } = req.body
  const result = await createConstituencyService(
    number,
    provinceId,
    districtIds,
  )

  if (!result) {
    return res.status(400).json({
      ok: false as const,
      status: 400,
      message: 'Create constituency failed',
    })
  }

  return res.status(200).json(result)
}

export async function deleteConstituencyController(
  req: Request,
  res: Response,
) {
  const id = req.params.id
  // Implement delete logic here
  console.log(`Deleting constituency with id: ${id}`)
  const result = await deleteConstituencyService(Number(id))

  if (!result) {
    return res.status(400).json({
      ok: false as const,
      status: 400,
      message: 'Create constituency failed',
    })
  }

  return res.status(200).json(result)
}

export async function editConstituencyController(req: Request, res: Response) {
  const id = req.params.id
  const updatedEvent = req.body
  // Implement update logic here
  const result = await editConstituencyService(
    Number(id),
    updatedEvent.number,
    updatedEvent.provinceId,
    updatedEvent.isClosed,
  )

  if (!result) {
    return res.status(400).json({
      ok: false as const,
      status: 400,
      message: 'Create constituency failed',
    })
  }

  return res.status(200).json(result)
}

export async function getAllConstituencyWithPaginationController(
  req: Request,
  res: Response,
) {
  const limit = req.query.limit as string
  const page = req.query.page as string

  const intLimit = Number(limit ?? '10')
  const intPage = Number(page ?? '1')

  // ===== validate page =====
  if (Number.isNaN(intPage) || intPage < 1) {
    return res.status(400).json({
      message: 'Invalid page. page must be an integer >= 1',
    })
  }

  // ===== validate limit =====
  if (Number.isNaN(intLimit) || intLimit < 1) {
    return res.status(400).json({
      message: 'Invalid limit. limit must be an integer >= 1',
    })
  }

  // ===== validate search =====
  const inputProvinceId = (req.query.provinceId as string) || undefined
  if (inputProvinceId && typeof inputProvinceId !== 'string') {
    return res.status(400).json({
      message: 'Invalid search. provinceId must be a string',
    })
  }

  const result = await getAllConstituencyWithPagination(
    intLimit,
    intPage,
    Number(inputProvinceId),
  )

  if (!result) {
    return res.status(400).json(result)
  }

  return res.status(200).json(result)
}

export async function toggleConstituencyController(
  req: Request,
  res: Response,
) {
  const id = Number(req.params.id)
  const result = await toggleConstituencyService(id)
  if (!result.ok) {
    return res.status(result.status).json({ message: result.message })
  }
  return res.status(200).json(result.data)
}

export async function closeAllConstituenciesController(
  _req: Request,
  res: Response,
) {
  await closeAllConstituenciesService()
  return res.status(200).json({
    ok: true as const,
    status: 200,
    message: 'Close all constituencies successfully',
  })
}

export async function openAllConstituenciesController(
  _req: Request,
  res: Response,
) {
  await openAllConstituenciesService()
  return res.status(200).json({
    ok: true as const,
    status: 200,
    message: 'Open all constituencies successfully',
  })
}

export async function getAvailableDistrictByProvinceIdController(
  req: Request,
  res: Response,
) {
  const provinceId = Number(req.params.provinceId)
  if (Number.isNaN(provinceId)) {
    return res.status(400).json({
      message: 'Invalid provinceId. provinceId must be a number',
    })
  }
  const result = await getAvailableDistrictByProvinceIdService(provinceId)
  if (!result.ok) {
    return res.status(result.status).json({ message: result.message })
  }
  return res.status(200).json(result)
}
