import {
  findAllPartyService, getAllPartyWithPaginationService, createPartyService, deletePartyService, editPartyService
} from '@/services/PartyService'
import type { Request, Response } from 'express'
import {
  createConstituencyService,
  deleteConstituencyService, editConstituencyService,
  getAllConstituencyWithPagination
} from "@/services/AdminService";

export async function findAllPartyController(
  req: Request,
  res: Response,
) {
  const result = await findAllPartyService()

  if (!result.ok) {
    return res.status(result.status).json({ message: result.message })
  }

  return res.status(200).json(result.data)
}

export async function  createPartyController(
  req: Request,
  res: Response,
) {
  const { name, logoUrl, policy } = req.body;
  const result = await createPartyService(name, logoUrl, policy)

  if (!result) {
    return res.status(400).json(
        { ok: false as const, status: 400, message: 'Create constituency failed'
        })
  }

  return res.status(200).json(result)
}

export async function deletePartyController(
  req: Request,
  res: Response,
) {
  const id = req.params.id;
  // Implement delete logic here
  console.log(`Deleting constituency with id: ${id}`);
  const result = await deletePartyService(Number(id))

  if (!result) {
    return res.status(400).json(
        { ok: false as const, status: 400, message: 'Create constituency failed'
        })
  }

  return res.status(200).json(result)
}

export async function editPartyController(
  req: Request,
  res: Response,
) {
  const id = req.params.id;
  const updatedEvent  = req.body;
  // Implement update logic here
  const result = await editPartyService(Number(id),updatedEvent.name,updatedEvent.logoUrl,updatedEvent.policy)

  if (!result) {
    return res.status(400).json(
        { ok: false as const, status: 400, message: 'Edit Parties failed'
        })
  }

  return res.status(200).json(result)
}
export async function getAllPartyWithPaginationController(
  req: Request,
  res: Response,
) {
  const limit = req.query.limit as string
  const page = req.query.page as string

  const intLimit = Number(limit?? '10')
  const intPage = Number(page?? '1')

  // ===== validate page =====
  if (Number.isNaN(intPage) || intPage < 1) {
    return res.status(400).json({
      message: "Invalid page. page must be an integer >= 1",
    });
  }

  // ===== validate limit =====
  if (Number.isNaN(intLimit) || intLimit < 1) {
    return res.status(400).json({
      message: "Invalid limit. limit must be an integer >= 1",
    });
  }


  const result = await getAllPartyWithPaginationService(intLimit, intPage)

  if (!result) {
    return res.status(400).json(result)
  }

  return res.status(200).json(result)
}