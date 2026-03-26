import { Router } from 'express'
import {
  getResults,
  getProvincesWithConstituenciesController,
  getResultByConstituencieIdController,
} from '../controllers/ResultController'
import {findAllPartyController} from "@/controllers/PartyController";
import {getAllCandidatesController} from "@/controllers/CandidateController";

const router = Router()

router.get('/results', getResults)
router.get('/contstituencies-result/:id', getResultByConstituencieIdController)
router.get(
  '/provinces-with-constituencies',
  getProvincesWithConstituenciesController,
)
router.get('/parties', findAllPartyController)
router.get('/candidates', getAllCandidatesController)
export default router
