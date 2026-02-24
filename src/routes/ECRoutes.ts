import {
  createPartyController,
  deletePartyController,
  editPartyController,
  getAllPartyWithPaginationController,
  findPartyByIdController,
} from '@/controllers/PartyController'
import { Router } from 'express'
import { requireAuth } from '@/middlewares/AuthMiddleware'
import { requireRole } from '@/middlewares/RoleMiddleware'
import { RoleName } from '@/models/role/roleNameDto'
import { getAllCandidatesController, upsertCandidateController } from "../controllers/CandidateController";

const router = Router()

// parties
router.get(
  '/parties',
  requireAuth,
  requireRole(RoleName.EC),
  getAllPartyWithPaginationController,
)
router.get(
  '/parties/:id',
  requireAuth,
  requireRole(RoleName.EC),
  findPartyByIdController,
)
router.post(
  '/parties',
  requireAuth,
  requireRole(RoleName.EC),
  createPartyController,
)
router.delete(
  '/parties/:id',
  requireAuth,
  requireRole(RoleName.EC),
  deletePartyController,
)
router.put(
  '/parties/:id',
  requireAuth,
  requireRole(RoleName.EC),
  editPartyController,
)

//==================================
//            Candidate
//==================================
router.get(
  '/candidates',
  requireAuth,
  requireRole(RoleName.EC),
  getAllCandidatesController,
)


export default router
