import { RequestHandler } from 'express';
import { Ok, BadRequest } from '../helper/error-handle';
import { Product } from '../models/product.model';
import { createProductSchema } from '../schema/productSchema';
import NodeCache from 'node-cache';
const nodeCache = new NodeCache();

export const createProduct: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let { error } = createProductSchema.validate(body);
    if (error) {
      return response.status(400).json({ message: error.message });
    }
    let payload = {
      name: body.name,
      price: body.price,
      description: body.description,
      categoryId: body.categoryId,
      quantity: body.quantity,
      image_url: request.file?.filename,
      sellerId: request.udata.id,
    };
    const data = await Product.create(payload);
    return Ok(response, `User is registerd successfully`, data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const findProductById: RequestHandler = async (request, response) => {
  try {
    let productId = request.query.pid;
    if (!productId) {
      return response.status(400).json({ message: 'productId is required' });
    }
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return response.status(404).json({ message: 'product not found !' });
    }
    return Ok(response, 'Product fetched successfully', product);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const findAllProduct: RequestHandler = async (request, response) => {
  try {
    const { name, page = 1, limit = 10 } = request.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const query: any = {};
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const products = await Product.find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .populate('categoryId')
      .populate('sellerId');

    const total = await Product.countDocuments(query);
    let resPayload = {
      products: products,
      total: total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
    };
    return Ok(response, 'All product fetched successfully', resPayload);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const updateProduct: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let productId = request.query.pid;
    if (!productId) {
      return response.status(400).json({ message: 'productId is required' });
    }
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return response.status(404).json({ message: 'product not found !' });
    }
    if (product.sellerId?.toString() !== request.udata.id) {
      return response
        .status(401)
        .json({ message: 'You are not authorized !!' });
    }
    const data = await Product.findByIdAndUpdate(productId, body);
    return Ok(response, 'product updated successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const deleteProduct: RequestHandler = async (request, response) => {
  try {
    let productId = request.query.pid;
    if (!productId) {
      return response.status(400).json({ message: 'productId is required' });
    }
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return response.status(404).json({ message: 'user not found !' });
    }
    if (product.sellerId?.toString() !== request.udata.id) {
      return response
        .status(401)
        .json({ message: 'You are not authorized !!' });
    }
    const data = await Product.findByIdAndDelete(productId);
    return Ok(response, `${product.name} is deleted successfully`, data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};
