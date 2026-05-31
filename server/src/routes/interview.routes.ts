import express from 'express';
import interviewController from '../controllers/interview.controller';

const interviewRouter = express.Router();

interviewRouter.post('/start', interviewController.startInterview);
interviewRouter.post('/message', interviewController.sendInterviewMessage);

export default interviewRouter;
