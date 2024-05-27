import { RequestHandler } from 'express';
import { Ok, BadRequest } from '../helper/error-handle';
import { Whishlist } from '../models/whishlist.model';
import { Cart } from '../models/cart.model';
import { Product } from '../models/product.model';
import { ObjectId } from 'mongodb';

export const createWhishlist: RequestHandler = async (request, response) => {
  try {
    let productId = request.query.pid;
    if (!productId) {
      return response.status(400).json({ message: 'productId is required !' });
    }
    const data = await Whishlist.create({
      userId: request.udata.id,
      productId: productId,
    });
    return Ok(response, 'Whishlist created successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const getWhishlistById: RequestHandler = async (request, response) => {
  try {
    let userId = request.udata.id;
    let productId = request.query.pid;
    if (!productId) {
      return response.status(400).json({ message: 'productId is required !' });
    }
    userId = new ObjectId(userId);
    const data = await Whishlist.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'products',
        },
      },
    ]);
    if (!data) {
      return response.status(404).json({ message: 'Whishlist not found !' });
    }
    return Ok(response, 'Whishlist fetched successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const moveWhishlistToCart: RequestHandler = async (
  request,
  response
) => {
  try {
    let userId = request.udata.id;
    let productId = request.query.pid;

    const whishlist = await Whishlist.findOne({ userId, productId });
    if (!whishlist) {
      return response
        .status(400)
        .json({ messsge: 'item not found in whishlist' });
    }

    const product = await Product.findOne({ _id: productId });
    const cart: any = await Cart.findOne({ userId, productId });
    if (cart) {
      var qty = cart.quantity + 1;
      var totalPrice = cart?.price * qty;

      const updateCart = await Cart.findByIdAndUpdate(cart._id, {
        quantity: qty,
        totalPrice: totalPrice,
        updatedAt: Date.now(),
      });
      await Whishlist.findByIdAndDelete(whishlist._id);
      return Ok(response, 'whishlist move into cart successfully', updateCart);
    } else {
      let payload = {
        userId: userId,
        productId: productId,
        quantity: 1,
        price: product?.price,
        totalPrice: product?.price,
      };
      const createCart = await Cart.create(payload);
      await Whishlist.findByIdAndDelete(whishlist._id);
      return Ok(response, 'whishlist move into cart successfully', createCart);
    }
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};
