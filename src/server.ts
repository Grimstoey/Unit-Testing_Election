import cors from 'cors'
import 'dotenv/config'
import express, { Request, Response } from 'express'
import adminRoutes from './routes/AdminRoutes'
import authRoutes from './routes/AuthRoutes'
import locationRoutes from './routes/LocationRoutes'
import userRoutes from './routes/UserRoutes'
import voterRoutes from './routes/VoterRoutes'

const app = express()
const PORT = process.env.PORT || 3000

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL as string,
      'http://localhost:3000',
      'http://localhost:3001',
      'https://electon-frontend-project.vercel.app',
    ],
    credentials: true,
  }),
)
app.use(express.json())

app.get('/', (req: Request, res: Response) =>
  res.json({ message: 'Welcome to Election Backend API' }),
)
app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)
app.use('/location', locationRoutes)
app.use('/users', userRoutes)
app.use('/voter', voterRoutes)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
