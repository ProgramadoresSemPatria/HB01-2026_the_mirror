import express from 'express';
import interviewController from '../controllers/interview.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const interviewRouter = express.Router();

// Secure all interview endpoints using JWT authorization middleware
interviewRouter.use(authMiddleware);

interviewRouter.post('/start', interviewController.startInterview);
interviewRouter.post('/message', interviewController.sendInterviewMessage);
interviewRouter.get('/history/:userId', interviewController.getInterviewHistory);
interviewRouter.get('/details/:interviewId', interviewController.getInterviewDetails);
interviewRouter.delete('/:interviewId', interviewController.deleteInterview);

export default interviewRouter;
