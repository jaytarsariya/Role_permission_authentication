import { RequestHandler } from 'express';
import { Ok, BadRequest } from '../helper/error-handle';
import { Order } from '../models/order.model';
import { createOrderSchema } from '../schema/orderSchema';
import { Cart } from '../models/cart.model';
import Razorpay from 'razorpay';
import Stripe from 'stripe';
const config = require('../config/config')['payment'];

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

export const createOrder: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let { error } = createOrderSchema.validate(body);
    if (error) {
      return response.status(400).json({ message: error.message });
    }
    const cart: any = await Cart.findOne({
      userId: request.udata.id,
      is_deleted: false,
    });
    if (!cart || cart.totalPrice <= 0) {
      return BadRequest(response, { message: 'Cart is empty or invalid' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: cart.totalPrice * 100, // Stripe expects the amount in cents
      currency: 'INR',
      metadata: { integration_check: 'accept_a_payment' },
    });
    // Here you can save the order details to your database, if needed
    const newOrder = new Order({
      userId: request.udata.id,
      orderItem: cart.product.map((item: any) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
      address: body.address.map((addr: any) => ({
        shipping_address_1: addr.shipping_address_1,
        shipping_address_2: addr.shipping_address_2,
        city: addr.city,
        zip: addr.zip,
        country: addr.country,
        phone: addr.phone,
      })),
      payment_mode: body.payment_mode, // Assuming payment mode comes in the request body
      paymentId: paymentIntent.id,
      total_Price: cart.totalPrice,
    });
    await Cart.findByIdAndUpdate(cart._id, { is_deleted: true });
    await Order.create(newOrder);
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

export const getUserAndProductDetails: RequestHandler = async (
  request,
  response
) => {
  try {
    const data = await Order.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItem.product_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
    ]);
    return Ok(response, 'order Fetched successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

// Howmany total product sale ?
export const getTotalSalesByProduct: RequestHandler = async (
  request,
  response
) => {
  try {
    const data = await Order.aggregate([
      {
        $unwind: '$orderItem',
      },
      {
        $group: {
          _id: '$orderItem.product_id',
          totalSales: {
            $sum: { $multiply: ['$orderItem.price', '$orderItem.quantity'] },
          },
          totalQuantity: { $sum: '$orderItem.quantity' },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: '$productDetails',
      },
    ]);
    return Ok(response, 'order fetched successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const getOrderWithSpecificDateRange: RequestHandler = async (
  request,
  response
) => {
  try {
    let body = request.body;
    console.log(new Date(body.fromDate));

    const data = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(body.fromDate),
            $lte: new Date(body.toDate),
          },
        },
      },
    ]);
    return Ok(response, 'fetched successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const getTotalOrdersOfUsers: RequestHandler = async (
  request,
  response
) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: '$userId',
          totalOrders: { $sum: 1 },
          totalAmountSpent: { $sum: '$total_Price' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $project: {
          _id: 1,
          totalOrders: 1,
          totalAmountSpent: 1,
          'userDetails.name': 1,
          'userDetails.address': 1,
        },
      },
    ]);
    return Ok(response, 'fetched successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};
