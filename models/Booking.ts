import mongoose, { Schema, model, models } from 'mongoose';

const BookingSchema = new Schema({
  bookingNumber: {
    type: String,
    unique: true,
  },
  packageId: {
    type: Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  },
  packageName: String,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: String,
  bookingHours: Number,
  adults: {
    type: Number,
    default: 0,
  },
  children: {
    type: Number,
    default: 0,
  },
  infants: {
    type: Number,
    default: 0,
  },
  pickupPoint: {
    name: String,
    address: String,
  },
  meetingPoint: {
    name: String,
    address: String,
  },
  package: {
    type: String,
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  },
  addOns: [{
    name: String,
    price: Number,
  }],
  subtotal: Number,
  vat: Number,
  vatPercentage: {
    type: Number,
    default: 5,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending',
  },
  paymentMethod: String,
  specialRequests: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate booking number before saving
BookingSchema.pre('save', function(next) {
  if (this.isNew) {
    this.bookingNumber = 'YC' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);
  }
  this.updatedAt = new Date();
  next();
});

export const Booking = models.Booking || model('Booking', BookingSchema);
