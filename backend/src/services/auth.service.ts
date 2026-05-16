import bcrypt from 'bcryptjs';
import { User } from '../models/User.model.js';
import { RefreshToken } from '../models/RefreshToken.model.js';
import { ApiError } from '../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { generateSecureToken, hashToken } from '../utils/crypto.js';
import { EmailService } from './email.service.js';
import type { AuthUserResponse } from '../types/auth.types.js';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../validators/auth.validator.js';

const formatUser = (user: InstanceType<typeof User>): AuthUserResponse => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  adminRole: user.adminRole ?? null,
  isEmailVerified: true,
  createdAt: user.createdAt.toISOString(),
});

const createTokenPair = async (user: InstanceType<typeof User>) => {
  const jti = generateSecureToken(16);
  const family = generateSecureToken(8);
  const basePayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    adminRole: user.adminRole ?? null,
  };

  const accessToken = generateAccessToken(basePayload);
  const refreshToken = generateRefreshToken({ ...basePayload, jti, family });

  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(jti),
    family,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

export class AuthService {
  static async register(input: RegisterInput) {
    const existingUser = await User.findOne({ email: input.email });
    if (existingUser) throw new ApiError(409, 'Email already registered');

    const user = await User.create({
      name: input.name,
      email: input.email,
      password: await bcrypt.hash(input.password, 12),
      isEmailVerified: true,
    });

    const tokens = await createTokenPair(user);
    return { user: formatUser(user), tokens };
  }

  static async login(input: LoginInput) {
    const user = await User.findOne({ email: input.email }).select('+password');
    if (!user || !user.isActive) throw new ApiError(401, 'Invalid credentials');

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) throw new ApiError(401, 'Invalid credentials');

    user.lastSeenAt = new Date();
    await user.save();

    const tokens = await createTokenPair(user);
    return { user: formatUser(user), tokens };
  }

  static async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      try {
        const payload = verifyRefreshToken(refreshToken);
        await RefreshToken.updateMany({ userId, family: payload.family }, { isRevoked: true });
      } catch {
        await RefreshToken.updateMany({ userId }, { isRevoked: true });
      }
    } else {
      await RefreshToken.updateMany({ userId }, { isRevoked: true });
    }
  }

  static async refresh(refreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const stored = await RefreshToken.findOne({
      tokenHash: hashToken(payload.jti),
      userId: payload.userId,
    });

    if (!stored || stored.isRevoked) {
      if (stored?.isRevoked) {
        await RefreshToken.updateMany({ family: stored.family }, { isRevoked: true });
      }
      throw new ApiError(401, 'Refresh token revoked');
    }

    stored.isRevoked = true;
    await stored.save();

    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) throw new ApiError(401, 'User not found or inactive');

    const jti = generateSecureToken(16);
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    const newRefreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      jti,
      family: stored.family,
    });

    await RefreshToken.create({
      userId: user._id,
      tokenHash: hashToken(jti),
      family: stored.family,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { user: formatUser(user), tokens: { accessToken, refreshToken: newRefreshToken } };
  }

  static async forgotPassword(input: ForgotPasswordInput) {
    const user = await User.findOne({ email: input.email });
    if (!user) return { message: 'If that email exists, a reset link was sent' };

    const token = generateSecureToken();
    user.passwordResetToken = hashToken(token);
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    await EmailService.sendPasswordResetEmail(user.email, token);
    return { message: 'If that email exists, a reset link was sent' };
  }

  static async resetPassword(input: ResetPasswordInput) {
    const user = await User.findOne({
      passwordResetToken: hashToken(input.token),
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) throw new ApiError(400, 'Invalid or expired reset token');

    user.password = await bcrypt.hash(input.password, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    await RefreshToken.updateMany({ userId: user._id }, { isRevoked: true });
    return { message: 'Password reset successful' };
  }

  static async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    return formatUser(user);
  }
}
