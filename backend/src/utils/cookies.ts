import type { Response } from 'express';
import { env } from '../config/env.js';

const isProduction = env.NODE_ENV === 'production';
const secure = env.COOKIE_SECURE || isProduction;

const baseCookieOptions = {
  httpOnly: true,
  secure,
  sameSite: 'strict' as const,
};

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie('accessToken', accessToken, {
    ...baseCookieOptions,
    maxAge: 15 * 60 * 1000,
    path: '/',
  });

  res.cookie('refreshToken', refreshToken, {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/v1/auth',
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/api/v1/auth' });
};
