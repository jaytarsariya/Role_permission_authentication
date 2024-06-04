import express from 'express';
const router = express.Router();
import {
  createUser,
  loginUser,
  findUserById,
  findAllUser,
  updateUser,
  deleteUser,
} from '../controller/user.controller';
import { auth, authorizerole } from '../middleware/auth';

router.post('/create', createUser);

router.post('/login', loginUser);

router.get('/getbyid', auth, findUserById);

router.get('/getall', auth, authorizerole('admin'), findAllUser);

router.put('/update', auth, authorizerole('admin'), updateUser);

router.delete('/delete', auth, authorizerole('admin'), deleteUser);

export default router;
