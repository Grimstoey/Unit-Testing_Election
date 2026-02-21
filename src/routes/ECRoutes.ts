import {
  createPartyController,
  deletePartyController,
  editPartyController,
  getAllPartyWithPaginationController,
  findPartyByIdController,
} from '@/controllers/PartyController'
import { Router } from 'express'
import { requireAuth } from '@/middlewares/AuthMiddleware'

const router = Router()

// parties
router.get('/parties', requireAuth, getAllPartyWithPaginationController)
router.get('/parties/:id', requireAuth, findPartyByIdController)
router.post('/parties', requireAuth, createPartyController)
router.delete('/parties/:id', requireAuth, deletePartyController)
router.put('/parties/:id', requireAuth, editPartyController)

export default router
