import { Router } from 'express'
import { requireAuth } from '@/middlewares/AuthMiddleware'
import {
  createConstituencyController,
  deleteConstituencyController,
  editConstituencyController,
  getAllConstituencyWithPaginationController,
} from '@/controllers/ConstituencyController'
import {
  getAllUsersController,
  getUserRolesController,
  removeUserRoleController,
} from '../controllers/UserController'
import { requireRole } from '@/middlewares/RoleMiddleware'
import { RoleName } from '@/models/role/roleNameDto'
import { assignRoleController } from '@/controllers/UserRoleController'

const router = Router()

router.get(
  '/constituencies',
  requireAuth,
  requireRole(RoleName.ADMIN),
  getAllConstituencyWithPaginationController,
)

router.post(
  '/constituencies',
  requireAuth,
  requireRole(RoleName.ADMIN),
  createConstituencyController,
)
router.delete(
  '/constituencies/:id',
  requireAuth,
  requireRole(RoleName.ADMIN),
  deleteConstituencyController,
)
router.put(
  '/constituencies/:id',
  requireAuth,
  requireRole(RoleName.ADMIN),
  editConstituencyController,
)

router.get(
  '/users',
  requireAuth,
  requireRole(RoleName.ADMIN),
  getAllUsersController,
)

router.get(
  '/users/:id/roles',
  requireAuth,
  requireRole(RoleName.ADMIN),
  getUserRolesController,
)

router.delete(
  '/users/:id/roles',
  requireAuth,
  requireRole(RoleName.ADMIN),
  removeUserRoleController,
)

router.post(
  '/users/:userId/roles',
  requireAuth,
  requireRole(RoleName.ADMIN),
  assignRoleController,
)

export default router
