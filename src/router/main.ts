import express from 'express';
const router = express.Router();
import userRouter from './userRouter';
import productRouter from './productRouter';
import categoryRouter from './categoryRouter';
import whishlistRouter from './whishlistRouter'
import cartRouter from './cartRouter';

router.use('/user', userRouter);

router.use('/product', productRouter);

router.use('/category', categoryRouter);

router.use('/whishlist',whishlistRouter)

router.use('/cart',cartRouter)

export default router;
