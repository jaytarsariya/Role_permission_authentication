import express from 'express'
const router = express.Router()
import { createOrder, viewAllOrder } from '../controller/order.controller'
import { auth, authorizerole } from '../middleware/auth'

router.post('/create',auth,createOrder)

router.get('/getall',auth,authorizerole('buyer'),viewAllOrder)

export default router