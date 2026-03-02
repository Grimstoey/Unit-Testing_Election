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
import {
  getAllCandidatesController,
  createCandidateController,
  updateCandidateController,
  deleteCandidateController,
} from '../controllers/CandidateController'
import { findAllConstituenciesController } from '@/controllers/ConstituencyController'

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

router.post(
  '/candidates',
  requireAuth,
  requireRole(RoleName.EC),
  createCandidateController,
)

router.patch(
  '/candidates/:id',
  requireAuth,
  requireRole(RoleName.EC),
  updateCandidateController,
)

router.delete(
  '/candidates/:id',
  requireAuth,
  requireRole(RoleName.EC),
  deleteCandidateController,
)

router.get(
  '/constituencies',
  requireAuth,
  requireRole(RoleName.EC),
  findAllConstituenciesController,
)

export default router
