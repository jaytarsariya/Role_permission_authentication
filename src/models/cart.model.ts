import mongoose, { Schema } from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Cart = mongoose.model('Cart', cartSchema);
