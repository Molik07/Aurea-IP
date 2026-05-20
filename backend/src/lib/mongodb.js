import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/index.js';

/**
 * Mongoose connection with exponential-backoff retry logic.
 * Retries up to MAX_RETRIES times before giving up.
 */

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

let retryCount = 0;

const connect = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('[MongoDB] Connected successfully');
    retryCount = 0; // reset on success
  } catch (err) {
    retryCount++;
    if (retryCount > MAX_RETRIES) {
      console.error('[MongoDB] Max retries reached. Exiting.');
      process.exit(1);
    }
    console.error(
      `[MongoDB] Connection failed (attempt ${retryCount}/${MAX_RETRIES}). Retrying in ${RETRY_DELAY_MS}ms...`,
      err.message
    );
    setTimeout(connect, RETRY_DELAY_MS);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected. Attempting to reconnect...');
  connect();
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] Connection error:', err.message);
});

export const connectMongoDB = connect;

export default mongoose;
