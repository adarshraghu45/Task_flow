import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { setAuthCookies, clearAuthCookies } from '../utils/cookies.js';

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);
    setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
    res.status(201).json({ success: true, message: 'Registration successful', data: result });
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
    res.status(200).json({ success: true, message: 'Login successful', data: result });
  });

  static logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = (req.cookies?.refreshToken as string) || req.body.refreshToken;
    if (req.user?.userId) await AuthService.logout(req.user.userId, refreshToken);
    clearAuthCookies(res);
    res.status(200).json({ success: true, message: 'Logged out successfully', data: null });
  });

  static refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = (req.cookies?.refreshToken as string) || req.body.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ success: false, message: 'Refresh token required' });
      return;
    }
    const result = await AuthService.refresh(refreshToken);
    setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
    res.status(200).json({ success: true, message: 'Token refreshed', data: result });
  });

  static forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.forgotPassword(req.body);
    res.status(200).json({ success: true, message: result.message, data: null });
  });

  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.resetPassword(req.body);
    res.status(200).json({ success: true, message: result.message, data: null });
  });

  static me = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.getProfile(req.user!.userId);
    res.status(200).json({ success: true, message: 'Profile retrieved', data: { user } });
  });
}
