import { Category } from '../models/category.model';
import { Ok, BadRequest } from '../helper/error-handle';
import { RequestHandler } from 'express';
import { createCategorySchema } from '../schema/categorySchema';

export const createCategory: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let { error } = createCategorySchema.validate(body);
    if (error) {
      return response.status(400).json({ message: error.message });
    }
    const data = await Category.create({
      name: body.name,
      description: body.description,
      parentId: body.parentId,
    });
    return Ok(response, 'Category created successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const getAllCategory: RequestHandler = async (request, response) => {
  try {
    const data = await Category.find();
    return Ok(response, 'All Category fetched successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};
