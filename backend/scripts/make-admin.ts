/**
 * Promote a user to platform admin by email.
 * Usage: npx tsx scripts/make-admin.ts user@example.com
 */
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env') });

const email = process.argv[2];
if (!email) {
  console.error('Usage: npx tsx scripts/make-admin.ts <email>');
  process.exit(1);
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set in backend/.env');
  process.exit(1);
}

await mongoose.connect(uri);
const result = await mongoose.connection.collection('users').updateOne(
  { email: email.toLowerCase() },
  { $set: { role: 'admin' } },
);

if (result.matchedCount === 0) {
  console.error(`No user found with email: ${email}`);
  process.exit(1);
}

console.log(`✓ ${email} is now a platform admin. Sign in via Login → Administrator tab.`);
await mongoose.disconnect();
