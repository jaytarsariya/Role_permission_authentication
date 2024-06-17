import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;
const status = {
  PENDING: 'PENDING',
  DELEIVERED: 'DELIVERED',
  SHIPPED: 'SHIPPED',
  CANCELED: 'CANCELED',
  RETURN: 'RETURN',
  FAILED: 'FAILED',
};

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    orderItem: [
      {
        product_id: {
          type: ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        },
      },
    ],
    address: {
      shipping_address_1: {
        type: String,
      },
      shipping_address_2: {
        type: String,
      },
      city: {
        type: String,
      },
      zip: {
        type: String,
      },
      country: {
        type: String,
      },
      phone: {
        type: Number,
      },
    },
    payment_mode: {
      type: String,
      enum: ['COD', 'PREPAID'],
      default: 'COD',
    },
    paymentId: {
      type: String,
    },
    order_status: {
      type: String,
      enum: Object.values(status),
      default: status.PENDING,
    },
    total_Price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model('order', orderSchema);
