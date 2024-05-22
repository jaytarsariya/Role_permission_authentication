import { RequestHandler } from 'express';
import { Ok, BadRequest } from '../helper/error-handle';
import { Whishlist } from '../models/whishlist.model';

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
    let productId = request.query.pid;
    if (!productId) {
      return response.status(400).json({ message: 'productId is required !' });
    }
    const data = await Whishlist.findById(productId);
    if (!data) {
      return response.status(404).json({ message: 'Whishlist not found !' });
    }
    return Ok(response, 'Whishlist fetched successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};
