import { Router } from 'express'
import {
  getResults,
  getProvincesWithConstituenciesController,
  getResultByConstituencieIdController,
} from '../controllers/ResultController'

const router = Router()

router.get('/results', getResults)
router.get('/contstituencies-result/:id', getResultByConstituencieIdController)
router.get(
  '/provinces-with-constituencies',
  getProvincesWithConstituenciesController,
)

export default router
