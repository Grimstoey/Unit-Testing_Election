import cors, { CorsOptions } from 'cors'
import 'dotenv/config'
import express, { Request, Response } from 'express'
import { errorHandler } from './middlewares/PrismaErrorHandler'
import adminRoutes from './routes/AdminRoutes'
import authRoutes from './routes/AuthRoutes'
import ecRoutes from './routes/ECRoutes'
import locationRoutes from './routes/LocationRoutes'
import publicRoutes from './routes/PublicRoutes'
import uploadRoutes from './routes/UploadRoutes'
import voterRoutes from './routes/VoterRoutes'

const app = express()
const PORT = process.env.PORT || 3000
const corsOptions: CorsOptions = {
  origin: [
    process.env.FRONTEND_URL as string,
    'http://localhost:3000',
    'http://localhost:3001',
    'https://electon-frontend-project.vercel.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
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

app.use('/public', publicRoutes)

// เอาไว้อันท้ายสุดหลังจากทุกอย่างไหลมาแล้ว ห้ามย้าย!!!!
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
