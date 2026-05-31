import express from 'express';
import interviewController from '../controllers/interview.controller';

const interviewRouter = express.Router();

interviewRouter.post('/start', interviewController.startInterview);
interviewRouter.post('/message', interviewController.sendInterviewMessage);
interviewRouter.get('/history/:userId', interviewController.getInterviewHistory);
interviewRouter.get('/details/:interviewId', interviewController.getInterviewDetails);

export default interviewRouter;
