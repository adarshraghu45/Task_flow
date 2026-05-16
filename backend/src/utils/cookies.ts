import type { Response } from 'express';
import { env } from '../config/env.js';

const isProduction = env.NODE_ENV === 'production';
const secure = env.COOKIE_SECURE || isProduction;

const resolveSameSite = (): 'strict' | 'lax' | 'none' => {
  try {
    const frontend = new URL(env.FRONTEND_URL);
    const cors = new URL(env.CORS_ORIGIN.split(',')[0].trim());
    if (frontend.origin !== cors.origin) {
      return 'none';
    }
  } catch {
    /* ignore invalid URLs */
  }
  return 'strict';
};

const sameSite = resolveSameSite();

const baseCookieOptions = {
  httpOnly: true,
  secure: sameSite === 'none' ? true : secure,
  sameSite,
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
  res.clearCookie('accessToken', { path: '/', sameSite, secure: baseCookieOptions.secure });
  res.clearCookie('refreshToken', {
    path: '/api/v1/auth',
    sameSite,
    secure: baseCookieOptions.secure,
  });
};
