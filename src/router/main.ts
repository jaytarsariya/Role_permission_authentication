import express from 'express';
const router = express.Router();
import userRouter from './userRouter';
import productRouter from './productRouter';
import categoryRouter from './categoryRouter';

router.use('/user', userRouter);

router.use('/product', productRouter);

router.use('/category', categoryRouter);

export default router;
