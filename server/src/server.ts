import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes/routes';
import envService from './services/env.service';

const app = express();
const PORT = envService.getEnv('PORT') || '3000';

app.use(express.json());

const isDevelopment = envService.getEnv('NODE_ENV') !== 'production';
const frontendUrl = envService.getEnv('FRONTEND_URL') || 'http://localhost:5173';

app.use(cors({
  origin: isDevelopment ? 'http://localhost:5173' : frontendUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// API Routes
app.use('/api', routes)

app.get('/', (req: Request, res: Response) => {
  res.json({ message: "The Mirror API" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
