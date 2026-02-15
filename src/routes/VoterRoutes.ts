import {
  getCandidatesController,
  createVoteController,
  updateVoteController,
} from '@/controllers/VoterController'
import { requireAuth } from '@/middlewares/AuthMiddleware'
import { Router } from 'express'

const router = Router()

router.get('/candidates', requireAuth, getCandidatesController)
// router.get('/my-vote', getMyVoteController)
router.post('/vote', requireAuth, createVoteController)
router.put('/vote', requireAuth, updateVoteController)

export default router
