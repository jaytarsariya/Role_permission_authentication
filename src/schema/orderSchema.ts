import joi from 'joi';

export const createOrderSchema = joi.object({
  userId: joi.string().required(), // MongoDB ObjectId pattern
  orderItem: joi
    .object({
      product_id: joi.string().required(), // MongoDB ObjectId pattern
      // quantity: joi.number().required(),
      // price: joi.number().required(),
    })
    .required(),
  address: joi
    .array()
    .items(
      joi.object({
        shipping_address_1: joi.string().required(),
        shipping_address_2: joi.string().allow(null, ''), // Optional field
        city: joi.string().required(),
        zip: joi.string().required(),
        country: joi.string().required(),
        phone: joi
          .string()
          .regex(/^[0-9]{10}$/)
          .messages({
            'string.pattern.base': `phone number must have 10 digits`,
          })
          .required(), // Assuming phone as string to accommodate different phone number formats
      })
    )
    .required(),
  paymentId: joi.string().optional().allow(null, ''), // Optional field
  order_status: joi.string().default('PENDING'),
  // total_Price: joi.number(),
});
