import mongoose, { Schema, model, models } from 'mongoose';

const PackageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['shared', 'premium', 'vip', 'private'],
  },
  price: {
    type: Number,
    required: true,
  },
  priceType: {
    type: String,
    enum: ['per_person', 'per_hour', 'flat_rate'],
    default: 'per_person',
  },
  minimumBookingHours: {
    type: Number,
    default: 2,
  },
  description: String,
  shortDescription: String,
  inclusions: [String],
  featured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
  images: [{
    url: String,
    publicId: String,
    caption: String,
  }],
  mainImage: {
    url: String,
    publicId: String,
  },
  yachtDetails: {
    capacity: Number,
    length: String,
    brand: String,
    year: Number,
    amenities: [String],
    description: String,
  },
  pricing: {
    adultPrice: Number,
    childPrice: Number,
    infantPrice: Number,
    vatPercentage: {
      type: Number,
      default: 5,
    },
  },
  availability: {
    monday: { type: Boolean, default: true },
    tuesday: { type: Boolean, default: true },
    wednesday: { type: Boolean, default: true },
    thursday: { type: Boolean, default: true },
    friday: { type: Boolean, default: true },
    saturday: { type: Boolean, default: true },
    sunday: { type: Boolean, default: true },
  },
  timeSlots: [{
    startTime: String,
    endTime: String,
    available: Boolean,
  }],
  pickupPoints: [{
    name: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
    image: {
      url: String,
      publicId: String,
    },
  }],
  meetingPoints: [{
    name: String,
    address: String,
    instructions: String,
    image: {
      url: String,
      publicId: String,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create slug from name before saving
PackageSchema.pre('save', function(next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  this.updatedAt = new Date();
  next();
});

export const Package = models.Package || model('Package', PackageSchema);
