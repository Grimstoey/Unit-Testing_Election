import express, { Request, Response } from 'express'
import 'dotenv/config'
import authRoutes from "./routes/AuthRoutes"

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Election Backend API' })
})

// routes
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
