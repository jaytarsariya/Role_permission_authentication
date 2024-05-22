import joi from 'joi';

export const createProductSchema = joi.object({
  name: joi.string().required(),
  price: joi.number().required(),
  description: joi.string().required(),
  categoryId: joi.string().required(),
  quantity: joi.number().required(),
  image_url: joi.string(),
});
