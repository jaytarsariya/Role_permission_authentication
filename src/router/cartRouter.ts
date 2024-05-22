import express from 'express';
const router = express.Router();
import { addToCart, viewCart } from '../controller/cart.controller';
import { auth } from '../middleware/auth';

router.post('/addtocart', auth, addToCart);

router.get('/viewcart', auth, viewCart);

export default router;
