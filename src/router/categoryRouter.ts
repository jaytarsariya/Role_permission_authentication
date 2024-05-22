import express from 'express';
const router = express.Router();
import {
  createCategory,
  getAllCategory,
} from '../controller/category.controller';

router.post('/create', createCategory);

router.get('/getall', getAllCategory);

export default router;
