import { RequestHandler } from 'express';
import { Ok, BadRequest } from '../helper/error-handle';
import { Cart } from '../models/cart.model';
import { Product } from '../models/product.model';
import { ObjectId } from 'mongodb';

export const addToCart: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let userId = request.udata.id;
    let productId = body.product_id;
    let total = [];
    let data: any = await Cart.findOne({ is_deleted: false, userId: userId });
    if (data) {
      let existingProduct = await data.product.find((item: any) =>
        item.product_id.equals(productId)
      );
      if (existingProduct) {
        var qty = existingProduct.quantity + body.quantity;
        var subTotal = existingProduct?.price * qty;
        var tot = existingProduct?.price * body.quantity;
        var UtotalPrice = data.totalPrice + tot;

        await Cart.updateOne(
          {
            _id: data._id,
            'product.product_id': productId,
          },
          {
            $set: {
              'product.$.quantity': qty,
              'product.$.sub_total': subTotal,
              totalPrice: UtotalPrice,
            },
          },
          {
            new: true,
          }
        );

        let responseData: any = await Cart.findOne({
          is_deleted: false,
          userId: userId,
        });

        return Ok(response, 'product add into cart', responseData);
      } else {
        // add new product
        let myproduct: any = await Product.findOne({ _id: productId });
        let UsubTotal = myproduct?.price * body.quantity;
        const product = {
          product_id: productId,
          quantity: body.quantity,
          price: myproduct?.price,
          sub_total: UsubTotal,
        };
        data.product.push(product);
        const totalPrice = data.product.reduce(
          (total: any, item: any) => total + item.sub_total,
          0
        );

        data.totalPrice = totalPrice;
        await data.save();
        let responseData = await Cart.findOne({
          is_deleted: false,
          userId: userId,
        });
        return Ok(response, 'new product add', responseData);
      }
    } else {
      var product: any = await Product.findOne({ _id: productId });
      let Usubtotal: any = product?.price * body.quantity;
      let payload = {
        userId: userId,
        product: [
          {
            product_id: productId,
            quantity: body.quantity,
            price: product?.price,
            sub_total: Usubtotal,
          },
        ],
        totalPrice: Usubtotal,
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
