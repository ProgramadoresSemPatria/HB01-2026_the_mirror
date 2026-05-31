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

  async getInterviewHistory(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({ error: 'Id do usuário é obrigatório' });
        return;
      }

      const result = await interviewService.getInterviewHistory(userId);
      res.status(200).json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Server] Fetching interview history failed:', message);
      res.status(500).json({ error: 'Failed to fetch interview history' });
    }
  }

  async getInterviewDetails(req: Request, res: Response): Promise<void> {
    try {
      const { interviewId } = req.params;
      if (!interviewId) {
        res.status(400).json({ error: 'Id da simulação é obrigatório' });
        return;
      }

      const result = await interviewService.getInterviewDetails(interviewId);
      if (!result) {
        res.status(404).json({ error: 'Simulação não encontrada' });
        return;
      }
      res.status(200).json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Server] Fetching interview details failed:', message);
      res.status(500).json({ error: 'Failed to fetch interview details' });
    }
  }

  async deleteInterview(req: Request, res: Response): Promise<void> {
    try {
      const { interviewId } = req.params;
      if (!interviewId) {
        res.status(400).json({ error: 'Id da simulação é obrigatório' });
        return;
      }

      await interviewService.deleteInterview(interviewId);
      res.status(200).json({ message: 'Simulação deletada com sucesso' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Server] Deleting interview failed:', message);
      res.status(500).json({ error: 'Failed to delete interview' });
    }
  }
}

const interviewController = new InterviewController();
export default interviewController;
