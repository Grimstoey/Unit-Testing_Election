import {
  getCandidatesController,
  createVoteController,
  updateVoteController,
  getMyVoteController,
  getConstituencyController,
} from '@/controllers/VoterController'
import { requireAuth } from '@/middlewares/AuthMiddleware'
import { Router } from 'express'

const router = Router()

router.get('/candidates', requireAuth, getCandidatesController)
router.get('/constituency', requireAuth, getConstituencyController)
router.get('/my-vote', requireAuth, getMyVoteController)
router.post('/vote', requireAuth, createVoteController)
router.put('/vote', requireAuth, updateVoteController)

export default router
