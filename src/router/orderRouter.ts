import express from 'express'
const router = express.Router()
import { createOrder, viewAllOrder,getUserAndProductDetails,getTotalSalesByProduct,getOrderWithSpecificDateRange,getTotalOrdersOfUsers } from '../controller/order.controller'
import { auth, authorizerole } from '../middleware/auth'

router.post('/create',auth,createOrder)

router.get('/getall',auth,authorizerole('buyer'),viewAllOrder)

router.get('/getuserandproductdetails',auth,authorizerole('admin'),getUserAndProductDetails)

router.get('/gettotalsalesbyproduct',auth,authorizerole('admin'),getTotalSalesByProduct)

router.get('/getorderwithspecificdaterange',auth,authorizerole('admin'),getOrderWithSpecificDateRange)

router.get('/totalorderofuser',auth,authorizerole('admin'),getTotalOrdersOfUsers)

export default router