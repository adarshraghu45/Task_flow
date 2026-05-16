import type { AdminRole } from './admin.types.js';

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  adminRole?: AdminRole | null;
}

export interface RefreshJwtPayload extends JwtPayload {
  jti: string;
  family: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  adminRole?: AdminRole | null;
  isEmailVerified: boolean;
  createdAt: string;
}
