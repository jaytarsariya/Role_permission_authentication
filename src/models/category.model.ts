import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  parentId: { type: mongoose.Types.ObjectId, default: null },
});

export const Category = mongoose.model('Category', categorySchema);
