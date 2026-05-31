import { Request, Response } from 'express';
import { z } from 'zod';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import authService from '../services/auth.service';

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { name, email, password } = validatedData;

      const result = await authService.register(name, email, password);

      res.status(201).json({
        message: 'User registered successfully',
        ...result,
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: error.errors[0]?.message || 'Dados inválidos para criar conta',
          details: error.errors,
        });
        return;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (message === 'Email already registered') {
        res.status(400).json({ error: message });
        return;
      }
      console.error('[Auth] Registration error:', message);
      res.status(500).json({ error: 'Internal server error during registration' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;

      const result = await authService.login(email, password);

      res.status(200).json({
        message: 'Login successful',
        ...result,
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: error.errors[0]?.message || 'Dados inválidos para entrar',
          details: error.errors,
        });
        return;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (message === 'Invalid email or password') {
        res.status(401).json({ error: message });
        return;
      }
      console.error('[Auth] Login error:', message);
      res.status(500).json({ error: 'Internal server error during login' });
    }
  }
}

const authController = new AuthController();
export default authController;
