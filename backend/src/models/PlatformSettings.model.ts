import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IPlatformSettings extends Document {
  key: string;
  value: Record<string, unknown>;
  updatedAt: Date;
}

const schema = new Schema<IPlatformSettings>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { updatedAt: true, createdAt: false } },
);

export const PlatformSettings: Model<IPlatformSettings> = mongoose.model<IPlatformSettings>(
  'PlatformSettings',
  schema,
);

export const DEFAULT_PLATFORM_SETTINGS = {
  branding: { appName: 'TaskFlow Manager', primaryColor: '#7c3aed' },
  security: { sessionTimeoutMinutes: 60, maxLoginAttempts: 5 },
  features: { aiEnabled: true, registrationsEnabled: true },
  payments: { stripeEnabled: false, razorpayEnabled: false },
};
