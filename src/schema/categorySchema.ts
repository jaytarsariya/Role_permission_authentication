import joi from 'joi';

export const createCategorySchema = joi.object({
  name: joi.string().required(),
  description: joi.string(),
  parentId: joi.string(),
});
