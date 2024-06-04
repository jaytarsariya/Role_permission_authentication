import express from 'express';
const router = express.Router();
import { dailyOrder } from '../controller/dashboard.controller';
import { auth } from '../middleware/auth';

router.get('/daily', auth, dailyOrder);

// router.post('/criteria',getUserByCriteria)

export default router;
