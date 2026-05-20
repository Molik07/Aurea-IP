import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Review schema.
 * productId references a MongoDB Product document.
 * userId is a PostgreSQL cuid (String) — cross-database reference.
 * verifiedPurchase is set server-side by checking order history.
 */
const reviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
      index: true,
    },
    userId: {
      type: String, // PostgreSQL cuid
      required: [true, 'User ID is required'],
      index: true,
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      maxlength: [100, 'User name cannot exceed 100 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer between 1 and 5',
      },
    },
    body: {
      type: String,
      required: [true, 'Review body is required'],
      minlength: [10, 'Review must be at least 10 characters'],
      maxlength: [2000, 'Review cannot exceed 2000 characters'],
    },
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Compound Index ───────────────────────────────────────────────────────────
// Prevent a user from reviewing the same product twice
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

// Sort by newest by default
reviewSchema.index({ productId: 1, createdAt: -1 });

const Review = model('Review', reviewSchema);

export default Review;
