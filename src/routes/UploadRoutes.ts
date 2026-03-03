import { Router } from 'express'
import multer from 'multer'
import { uploadController } from '../controllers/UploadController'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/', upload.single('file'), uploadController)

export default router
