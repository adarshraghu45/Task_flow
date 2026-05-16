import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log('Connected to database:', mongoose.connection.db?.databaseName);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Connection failed:', err.message);
  process.exit(1);
});
