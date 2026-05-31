import { Request, Response } from 'express';
import { z } from 'zod';
import interviewService from '../services/interview.service';
import { startInterviewSchema, sendInterviewMessageSchema } from '../schemas/interview.schema';

class InterviewController {
  async sendInterviewMessage(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = sendInterviewMessageSchema.parse(req.body);
      const { interviewId, scenario, history, candidateMessage, userId } = validatedData;

      const result = await interviewService.sendInterviewMessage(
        interviewId,
        scenario,
        history,
        candidateMessage,
        userId
      );

      res.status(200).json(result);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: error.errors[0]?.message || 'Dados inválidos para enviar mensagem',
          details: error.errors,
        });
        return;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Server] Message handler failed:', message);
      res.status(500).json({ error: 'Internal server error processing response' });
    }
  }

  async startInterview(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = startInterviewSchema.parse(req.body);
      const { scenario, userId } = validatedData;

      const result = await interviewService.startInterview(scenario, userId);

      res.status(200).json(result);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: error.errors[0]?.message || 'Dados inválidos para iniciar simulação',
          details: error.errors,
        });
        return;
      }
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Server] Start interview transaction failed:', message);
      res.status(500).json({ error: 'Failed to initialize simulation record in database' });
    }
  }
}

const interviewController = new InterviewController();
export default interviewController;
