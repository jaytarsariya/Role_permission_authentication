import { RequestHandler } from 'express';
import { Ok, BadRequest } from '../helper/error-handle';
import { User } from '../models/user.model';
import { createUserSchema, loginUserSchema } from '../schema/userSchema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import NodeCache from 'node-cache';
const config = require('../config/config')['development'];

const nodeCache = new NodeCache();
const secretKey = config.jwt_secret;

export const createUser: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let { error } = createUserSchema.validate(body);
    if (error) {
      return response.status(400).json({ message: error.message });
    }
    const user = await User.findOne({ email: body.email, is_deleted: false });
    if (user) {
      return response.status(400).json({ message: 'User already exists' });
    }
    const hashedPass = await bcrypt.hash(body.password, 10);
    let payload = {
      name: body.name,
      email: body.email,
      password: hashedPass,
      address: body.address,
      phone_number: body.phone_number,
      role: body.role,
    };
    const data = await User.create(payload);
    return Ok(response, `User is registerd successfully`, data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const loginUser: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let { error } = loginUserSchema.validate(body);
    if (error) {
      return response.status(400).json({ message: error.message });
    }
    const user: any = await User.findOne({
      is_deleted: false,
      $or: [{ email: body.email }, { phone_number: body.phone_number }],
    });
    if (!user) {
      return response.status(404).json({ message: 'user not found !' });
    }
    const comparePass = await bcrypt.compare(body.password, user.password);
    if (!comparePass) {
      return response.status(400).json({ message: 'Invalid credentials !' });
    }
    const token = await jwt.sign({ id: user._id, role: user.role }, secretKey, {
      expiresIn: '1w',
    });
    response.cookie('token', token);
    return Ok(response, `${user.role} is login successfully`, token);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const findUserById: RequestHandler = async (request, response) => {
  try {
    let userId = request.query.userId;
    if (!userId) {
      return response.status(400).json({ message: 'userId is required' });
    }
    const user = await User.findOne({ _id: userId, is_deleted: false });
    if (!user) {
      return response.status(404).json({ message: 'user not found !' });
    }
    return Ok(response, 'User fetched successfully', user);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const findAllUser: RequestHandler = async (request, response) => {
  try {
    const alreadyInCached = nodeCache.get('CachedData');
    if (typeof alreadyInCached === 'string') {
      return JSON.parse(alreadyInCached);
    }
    const user = await User.find({ is_deleted: false, role: 'buyer' });
    nodeCache.set('CachedData', JSON.stringify(user), 60);
    return Ok(response, 'All user fetched successfully', user);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const updateUser: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let userId = request.query.userId;
    if (!userId) {
      return response.status(400).json({ message: 'userId is required' });
    }
    const user = await User.findOne({ _id: userId, is_deleted: false });
    if (!user) {
      return response.status(404).json({ message: 'user not found !' });
    }
    const data = await User.findByIdAndUpdate(userId, body);
    return Ok(response, 'User updated successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const deleteUser: RequestHandler = async (request, response) => {
  try {
    let userId = request.query.userId;
    if (!userId) {
      return response.status(400).json({ message: 'userId is required' });
    }
    const user = await User.findOne({ _id: userId, is_deleted: false });
    if (!user) {
      return response.status(404).json({ message: 'user not found !' });
    }
    const data = await User.findByIdAndUpdate(userId, { is_deleted: true });
    return Ok(response, `${user.name} is deleted successfully`, data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};
