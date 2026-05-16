import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type { AdminRole } from '../types/admin.types.js';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  adminRole?: AdminRole | null;
  avatar?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  suspendedAt?: Date;
  suspendReason?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastSeenAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    adminRole: {
      type: String,
      enum: ['super_admin', 'admin', 'moderator', 'support_staff', null],
      default: null,
    },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
    suspendedAt: Date,
    suspendReason: String,
    isEmailVerified: { type: Boolean, default: true },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    lastSeenAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
