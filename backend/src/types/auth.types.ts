export interface JwtPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
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
  isEmailVerified: boolean;
  createdAt: string;
}
