import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Variant sub-document schema.
 */
const variantSchema = new Schema({
  shade: {
    type: String,
    trim: true,
  },
  hexColor: {
    type: String,
    trim: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
});

/**
 * Product schema supporting both original backend requirements
 * and flexible frontend fields.
 */
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    ingredients: {
      type: String,
      default: '',
    },
    howToUse: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    discountPrice: {
      type: Number,
      default: null,
    },
    pricePaise: {
      type: Number,
    },
    discountPricePaise: {
      type: Number,
    },
    rating: {
      type: Number,
      default: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    shadeCount: {
      type: Number,
      default: 0,
    },
    concerns: {
      type: [String],
      default: [],
    },
    skinTypes: {
      type: [String],
      default: [],
    },
    shades: {
      type: Schema.Types.Mixed,
      default: [],
    },
    variants: {
      type: [variantSchema],
      default: [],
    },
    attributes: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Pre-save hook to ensure slug and pricePaise are populated if missing
productSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
  }
  if (this.price && !this.pricePaise) {
    this.pricePaise = this.price * 100;
  }
  if (this.discountPrice && !this.discountPricePaise) {
    this.discountPricePaise = this.discountPrice * 100;
  }
  next();
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
productSchema.index({ name: 'text', brand: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ createdAt: -1 });

// ─── Virtuals ─────────────────────────────────────────────────────────────────
productSchema.virtual('priceRupees').get(function () {
  return this.price || (this.pricePaise ? this.pricePaise / 100 : 0);
});

productSchema.virtual('discountPriceRupees').get(function () {
  return this.discountPrice !== null ? this.discountPrice : (this.discountPricePaise ? this.discountPricePaise / 100 : null);
});

const Product = model('Product', productSchema);

export default Product;
