import express from 'express';
const router = express.Router();
import {
  createProduct,
  findProductById,
  findAllProduct,
  updateProduct,
  deleteProduct,
} from '../controller/product.controller';
import { upload } from '../utils/fileUpload';
import { auth, authorizerole } from '../middleware/auth';

router.post('/create',auth,authorizerole('seller'),upload.single('file'),createProduct);

router.get('/getall', findAllProduct);

router.get('/getbyid', findProductById);

router.put('/update', auth, authorizerole('seller'), updateProduct);

router.delete('/delete', auth, authorizerole('seller'), deleteProduct);

export default router;
