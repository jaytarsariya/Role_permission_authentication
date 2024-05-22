import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const config = require('../config/config')['development'];
const secretKey = config.jwt_secret;

declare global {
  namespace Express {
    interface Request {
      udata?: any;
    }
  }
}

export const auth = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const token = request.cookies.token;
    if (!token) {
      return response.status(400).json({ message: 'login first !' });
    }
    const decodeToken = jwt.verify(token, secretKey);
    if (!decodeToken) {
      return response.status(400).json({ message: 'Token is invalid !' });
    }
    request.udata = decodeToken;
    next();
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};

export const authorizerole = (...roles: string[]) => {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.udata || !roles.includes(request.udata.role)) {
      return response
        .status(401)
        .json({ message: 'You are not authorized to perform this action !' });
    }
    next();
  };
};
