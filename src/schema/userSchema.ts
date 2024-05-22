import joi from 'joi';

export const createUserSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  address: joi.string().required(),
  phone_number: joi
    .string()
    .required()
    .regex(/^[0-9]{10,15}$/)
    .messages({ 'string.pattern.base': `phone number must have 10 digits.` }),
  role: joi.string(),
});

export const loginUserSchema = joi.object({
  email: joi.string().email(),
  phone_number: joi
    .string()
    .regex(/^[0-9]{10,15}$/)
    .messages({ 'string.pattern.base': 'phone number must have 10 digits' }),
  password: joi.string().required(),
});
