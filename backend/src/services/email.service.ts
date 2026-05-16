import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export class EmailService {
  static async sendVerificationEmail(email: string, token: string): Promise<void> {
    const link = `${env.FRONTEND_URL}/verify-email?token=${token}`;
    logger.info(`[Email] Verification link for ${email}: ${link}`);
  }

  static async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const link = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    logger.info(`[Email] Password reset link for ${email}: ${link}`);
  }
}
