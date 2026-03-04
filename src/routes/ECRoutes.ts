import { requireAuth } from '@/middlewares/AuthMiddleware'
import { requireRole } from '@/middlewares/RoleMiddleware'
import { RoleName } from '@/models/role/roleNameDto'
import { Router } from 'express'
import {
  createCandidateController,
  deleteCandidateController,
  getAllCandidatesController,
  updateCandidateController,
} from '@/controllers/CandidateController'
import {
  closeAllConstituenciesController,
  getAllConstituencyWithPaginationController,
  openAllConstituenciesController,
  toggleConstituencyController,
} from '@/controllers/ConstituencyController'
import {
  createPartyController,
  deletePartyController,
  editPartyController,
  findPartyByIdController,
  getAllPartyWithPaginationController,
} from '@/controllers/PartyController'

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

//==================================
//            Constituency
//==================================
router.get(
  '/constituencies',
  requireAuth,
  requireRole(RoleName.EC),
  getAllConstituencyWithPaginationController,
)

router.post(
  '/constituencies/close-all',
  requireAuth,
  requireRole(RoleName.EC),
  closeAllConstituenciesController,
)

router.post(
  '/constituencies/open-all',
  requireAuth,
  requireRole(RoleName.EC),
  openAllConstituenciesController,
)

router.post(
  '/constituencies/:id/toggle',
  requireAuth,
  requireRole(RoleName.EC),
  toggleConstituencyController,
)

export default router
