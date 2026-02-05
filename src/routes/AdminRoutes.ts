import { findAllConstituenciesController } from '@/controllers/AdminController'
import { Router } from 'express'

const router = Router()

// POST /auth/register
router.get('/constituencies', findAllConstituenciesController)

export default router
