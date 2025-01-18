import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const {
  FARCASTER_BOT_MNEMONIC,
  SIGNER_UUID,
  NEYNAR_API_KEY,
  PUBLISH_CAST_TIME = '09:00',
  TIME_ZONE = 'UTC'
} = process.env;

if (!FARCASTER_BOT_MNEMONIC) {
  throw new Error('FARCASTER_BOT_MNEMONIC is required');
}

if (!SIGNER_UUID) {
  throw new Error('SIGNER_UUID is required');
}

if (!NEYNAR_API_KEY) {
  throw new Error('NEYNAR_API_KEY is required');
}
