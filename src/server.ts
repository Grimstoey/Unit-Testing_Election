import express, { Request, Response } from 'express'
import 'dotenv/config'
import authRoutes from './routes/AuthRoutes'
import adminRoutes from './routes/AdminRoutes'
import userRoutes from "./routes/UserRoutes"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Election Backend API' });
})

// routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
