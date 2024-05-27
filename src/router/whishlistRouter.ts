import express from 'express';
const router = express.Router();
import {
  createWhishlist,
  getWhishlistById,
  moveWhishlistToCart,
} from '../controller/whishlist.controller';
import { auth, authorizerole } from '../middleware/auth';

router.post('/create', auth, authorizerole('buyer'), createWhishlist);

router.get('/getbyid', auth, getWhishlistById);

router.post('/movetocart', auth, authorizerole('buyer'), moveWhishlistToCart);

export default router;
