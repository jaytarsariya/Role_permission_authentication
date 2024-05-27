import { RequestHandler } from 'express';
import { Ok, BadRequest } from '../helper/error-handle';
import { Order } from '../models/order.model';
import { createOrderSchema } from '../schema/orderSchema';
import { Cart } from '../models/cart.model';
import Razorpay from 'razorpay';
const config = require('../config/config')['payment'];

export const createOrder: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let { error } = createOrderSchema.validate(body);
    if (error) {
      return response.status(400).json({ message: error.message });
    }
    var instance = {
      key_id: config.KEY_Id,
      key_secret: config.KEY_SECRET,
    };
    let totalQuantity = 0;
    const cart = await Cart.find({ userId: request.udata.id });

    return Ok(response, 'Order created successfully', cart);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const viewAllOrder: RequestHandler = async (request, response) => {
  try {
    let userId = request.udata.id;
    const data = await Order.find({ userId: userId });
    return Ok(response, 'order fetched successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};
