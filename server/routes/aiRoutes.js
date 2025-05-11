import express from 'express';
import { extractTagsFromPrompt, getCourseFact } from '../controllers/aiController.js';

const aiRouter = express.Router();

aiRouter.post('/extract-tags', extractTagsFromPrompt);
aiRouter.post('/course-fact', getCourseFact); // ✅ new route

export default aiRouter;
