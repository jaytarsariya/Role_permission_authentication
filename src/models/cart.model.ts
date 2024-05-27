import mongoose, { Schema } from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  product: [
    {
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
      sub_total:{
        type:Number,
      }
    },
  ],
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
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

export const Cart = mongoose.model('Cart', cartSchema);
