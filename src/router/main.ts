import express from 'express';
const router = express.Router();
import userRouter from './userRouter';
import productRouter from './productRouter';
import categoryRouter from './categoryRouter';
import whishlistRouter from './whishlistRouter';
import cartRouter from './cartRouter';
import orderRouter from './orderRouter';
import dashboardRoute from './dashboardRouter';
import testOrderRoute from './testOrderRoute';

router.use('/user', userRouter);

router.use('/product', productRouter);

router.use('/category', categoryRouter);

router.use('/whishlist', whishlistRouter);

router.use('/cart', cartRouter);

router.use('/order', orderRouter);

router.use('/dashboard', dashboardRoute);

router.use('/testorder', testOrderRoute);

export default router;
