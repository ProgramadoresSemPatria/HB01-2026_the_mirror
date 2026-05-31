import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import envService from '../services/env.service';

const JWT_SECRET = envService.getEnv('JWT_SECRET');

export const jwtPayloadSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
});

export type DecodedUser = z.infer<typeof jwtPayloadSchema>;

export interface AuthenticatedRequest extends Request {
  user?: DecodedUser;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token de autenticação não fornecido ou inválido.' });
    return;
  }

  const token = authHeader.substring(7);

  try {
    if (!JWT_SECRET) {
      res.status(500).json({ error: 'Erro de configuração do servidor.' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const parsedUser = jwtPayloadSchema.parse(decoded);

    req.user = parsedUser;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token de autenticação inválido ou expirado.' });
    return;
  }
}
