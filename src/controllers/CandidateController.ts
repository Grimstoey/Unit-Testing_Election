import type { Request, Response } from 'express'
import { GetAllCandidateQueryDto } from '@/models/candidate/getAllCandidateDto'
import {
  getAllCandidatesService,
  createCandidateService,
  updateCandidateService,
  deleteCandidateService,
} from '@/services/CandidateService'
import { CreateCandidateDto } from '@/models/candidate/createCandidateDto'

// =========================================
//              สร้าง candidate
// =========================================
export async function createCandidateController(req: Request, res: Response) {
  try {
    const user = req.body.user

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!req.body.constituencyId) {
      return res.status(400).json({
        message: 'constituencyId is required',
      })
    }

    const input: CreateCandidateDto = {
      citizenId: req.body.citizenId,
      number: Number(req.body.number),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      candidatePolicy: req.body.candidatePolicy,
      imageUrl: req.body.imageUrl,
      partyId: Number(req.body.partyId),
      constituencyId: Number(req.body.constituencyId),
    }

    const candidate = await createCandidateService(input, user.id)

    return res.status(201).json({
      message: 'Candidate created successfully',
      data: candidate,
    })
  } catch (error: any) {
    console.error('CREATE CANDIDATE ERROR:', error)

    return res.status(400).json({
      message: error.message,
    })
  }
}

// =========================================
//          เรียกดู candidate ทั้งหมด
// =========================================
export async function getAllCandidatesController(req: Request, res: Response) {
  const pageInt = req.query.page ? parseInt(req.query.page as string) : 1
  const limitInt = req.query.limit ? parseInt(req.query.limit as string) : 10

  const queryDto: GetAllCandidateQueryDto = {
    page: pageInt,
    limit: limitInt,
    search: req.query.search as string | undefined,
    sortBy: req.query.sortBy as any,
    order: req.query.order as any,

    partyId: req.query.partyId
      ? parseInt(req.query.partyId as string)
      : undefined,

    constituencyId: req.query.constituencyId
      ? parseInt(req.query.constituencyId as string)
      : undefined,

    provinceId: req.query.provinceId
      ? parseInt(req.query.provinceId as string)
      : undefined,
  }

  const result = await getAllCandidatesService(queryDto)

  res.status(200).json(result)
}

// =========================================
//              update candidate
// =========================================
export async function updateCandidateController(req: Request, res: Response) {
  try {
    const intId = Number(req.params.id)

    if (isNaN(intId) || intId <= 0) {
      return res.status(400).json({
        message: 'Invalid candidate id',
      })
    }

    const user = req.body.user

    const updatedCandidate = await updateCandidateService(
      intId,
      req.body,
      user.id,
    )

    return res.status(200).json({
      message: 'Candidate updated successfully',
      data: updatedCandidate,
    })
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    })
  }
}

// ลบ candidate
export async function deleteCandidateController(req: Request, res: Response) {
  try {
    const intId = Number(req.params.id)

    const result = await deleteCandidateService(intId)

    return res.status(200).json(result)
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}
