import bcrypt from 'bcryptjs';
import { User } from '../models/User.model.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const ensureDefaultAdmin = async () => {
  const email = env.ADMIN_EMAIL.toLowerCase();
  const existing = await User.findOne({ email });

  if (existing) {
    const updates: Record<string, unknown> = {
      role: 'admin',
      adminRole: 'super_admin',
      isActive: true,
      name: env.ADMIN_NAME,
    };
    if (env.NODE_ENV !== 'production') {
      updates.password = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
    }
    await User.updateOne({ email }, updates);
    logger.info(`Default admin ready: ${email}`);
    return;
  }

  await User.create({
    name: env.ADMIN_NAME,
    email,
    password: await bcrypt.hash(env.ADMIN_PASSWORD, 12),
    role: 'admin',
    adminRole: 'super_admin',
    isEmailVerified: true,
    isActive: true,
  });

  logger.info(`Default admin created: ${email}`);
};
