import express from 'express';
const router = express.Router();
import {
  createWhishlist,
  getWhishlistById,
} from '../controller/whishlist.controller';
import { auth, authorizerole } from '../middleware/auth';

router.post('/create', auth, authorizerole('buyer'), createWhishlist);

router.get('/getall', getWhishlistById);

export default router;
