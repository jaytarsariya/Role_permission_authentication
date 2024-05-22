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

router.post('/create', createUser);

router.post('/login', loginUser);

router.get('/getbyid', findUserById);

router.get('/getall', findAllUser);

router.put('/update', updateUser);

router.delete('/delete', deleteUser);

export default router;
