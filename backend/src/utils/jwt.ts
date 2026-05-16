import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { JwtPayload, RefreshJwtPayload } from '../types/auth.types.js';

const accessSignOptions: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] };
const refreshSignOptions: SignOptions = {
  expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
};

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, accessSignOptions);
};

export const generateRefreshToken = (payload: RefreshJwtPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, refreshSignOptions);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): RefreshJwtPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshJwtPayload;
};
