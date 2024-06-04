import express from 'express';
const router = express.Router();
import {
  createCategory,
  getAllCategory,
} from '../controller/category.controller';
import { auth, authorizerole } from '../middleware/auth';

router.post('/create', auth, authorizerole('admin'), createCategory);

router.get('/getall', auth, authorizerole('admin'), getAllCategory);

export default router;
