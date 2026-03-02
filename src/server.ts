import cors, { CorsOptions } from 'cors'
import 'dotenv/config'
import express, { Request, Response } from 'express'
import adminRoutes from './routes/AdminRoutes'
import authRoutes from './routes/AuthRoutes'
import locationRoutes from './routes/LocationRoutes'
import voterRoutes from './routes/VoterRoutes'
import { errorHandler } from './middlewares/PrismaErrorHandler'
import ecRoutes from './routes/ECRoutes'
import uploadRoutes from './routes/UploadRoutes'

const app = express()
const PORT = process.env.PORT || 3000
const corsOptions: CorsOptions = {
  origin: [
    process.env.FRONTEND_URL as string,
    'http://localhost:3000',
    'http://localhost:3001',
    'https://electon-frontend-project.vercel.app',
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}

app.use(cors(corsOptions))

app.use(express.json())

app.get('/', (req: Request, res: Response) =>
  res.json({ message: 'Welcome to Election Backend API' }),
)

// routes
app.use('/auth', authRoutes)

app.use('/admin', adminRoutes)
app.use('/ec', ecRoutes)

app.use('/location', locationRoutes)

app.use('/voter', voterRoutes)

app.use('/upload', uploadRoutes)

// เอาไว้อันท้ายสุดหลังจากทุกอย่างไหลมาแล้ว ห้ามย้าย!!!!
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
