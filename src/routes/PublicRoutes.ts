import { Router } from 'express'
import { getResults } from '../controllers/ResultController'

const router = Router()

router.get('/results', getResults)

export default router
