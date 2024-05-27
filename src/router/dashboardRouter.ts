import express from 'express';
const router = express.Router();
import { dailyOrder } from '../controller/dashboard.controller';
import { auth } from '../middleware/auth';

router.get('/daily', auth, dailyOrder);

export default router;
