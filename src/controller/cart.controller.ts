import { RequestHandler } from 'express';
import { Ok, BadRequest } from '../helper/error-handle';
import { Cart } from '../models/cart.model';
import { Product } from '../models/product.model';
import { ObjectId } from 'mongodb';

export const addToCart: RequestHandler = async (request, response) => {
  try {
    let userId = request.udata.id;
    let productId = request.query.pid;

    let product = await Product.findOne({ _id: productId });
    let data: any = await Cart.findOne({
      $and: [{ userId: userId }, { product_id: productId }],
    });
    if (data) {
      var qty = data.quantity + 1;
      var price = data?.price * qty;
      const updatedCart = await Cart.findByIdAndUpdate(data._id, {
        quantity: qty,
        totalPrice: price,
      });
      return Ok(response, 'Product added into cart !!', updatedCart);
    } else {
      let payload = {
        userId: userId,
        product_id: productId,
        quantity: 1,
        price: product?.price,
        totalPrice: product?.price,
      };
      const cart = await Cart.create(payload);
      return Ok(response, 'Product added into cart', cart);
    }
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const viewCart: RequestHandler = async (request, response) => {
  try {
    let userId: any = request.udata.id;
    userId = new ObjectId(userId);
    const cartData = await Cart.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id',
          as: 'products',
        },
      },
    ]);
    if (!cartData) {
      return response.status(400).json({ message: 'Cart not found' });
    }
    const viewData = await cartData.map((data) => {
      return {
        quantity: data.quantity,
        price: data.price,
        totalPrice: data.totalPrice,
        products: data.products,
      };
    });
    return Ok(response, 'Cart fetched successfully', viewData);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};
