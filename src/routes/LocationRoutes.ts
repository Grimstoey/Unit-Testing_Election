import { Router } from 'express'
import {
  getAllProvincesController,
  getDistrictsByProvinceIdController,
  getConstituenciesByDistrictIdController,
} from '../controllers/LocationController'

const router = Router()

router.get(
  '/provinces/:provinceId/districts',
  getDistrictsByProvinceIdController,
)
router.get('/provinces', getAllProvincesController)
router.get(
  '/districts/:districtId/constituencies',
  getConstituenciesByDistrictIdController,
)

export default router
