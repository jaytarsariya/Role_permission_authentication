import mongoose from 'mongoose'

const whishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }
},{
  timestamps:true
})

export const Whishlist = mongoose.model('Whishlist',whishlistSchema)