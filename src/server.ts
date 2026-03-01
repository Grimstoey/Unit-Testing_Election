import cors, {CorsOptions} from 'cors';
import 'dotenv/config'
import express, { Request, Response } from 'express'
import adminRoutes from './routes/AdminRoutes'
import authRoutes from './routes/AuthRoutes'
import locationRoutes from './routes/LocationRoutes'
import voterRoutes from './routes/VoterRoutes'
import partyRoutes from '@/routes/ECRoutes'
import { errorHandler } from './middlewares/PrismaErrorHandler'
import ecRoutes from "./routes/ECRoutes"
import path from 'path';
import multer from 'multer';
import { uploadFile } from './services/UploadFileService';

const webApp = express()
const webPort= 5050
 webApp.use(express.static(path.join(process.cwd())));
 webApp.listen(webPort, () => {
    console.log(`WebApp listening at http://localhost:${webPort}`)
 })

const app = express()
const PORT = process.env.PORT || 3000
const corsOptions:CorsOptions = {
   origin: ['http://localhost:5051'],
   methods: ['GET','POST','OPTIONS'],
   allowedHeaders: ['Content-Type','Authorization'],
};
const upload = multer({ storage: multer.memoryStorage() });

+app.post('/upload', upload.single('file'), async (req: any, res: any) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const bucket = 'Election_App';
    const filePath = `uploads`;

    await uploadFile(bucket, filePath, file);

    res.status(200).send('File uploaded successfully.');
  } catch (error) {
    res.status(500).send('Error uploading file.');
  }
});

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

// routes
app.use('/auth', authRoutes)

app.use('/admin', adminRoutes)
app.use('/ec', ecRoutes)

app.use('/location', locationRoutes)

app.use('/voter', voterRoutes)

// เอาไว้อันท้ายสุดหลังจากทุกอย่างไหลมาแล้ว ห้ามย้าย!!!!
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
