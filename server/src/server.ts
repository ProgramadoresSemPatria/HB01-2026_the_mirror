import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes/routes';
import envService from './services/env.service';
import { errorHandler } from './middlewares/error.middleware';

const app = express();
const PORT = envService.getEnv('PORT') || '3000';

app.use(express.json());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// API Routes
app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: "The Mirror API" });
});

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
