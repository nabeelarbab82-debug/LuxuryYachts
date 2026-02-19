import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  // Customer Information
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  // Package Details
  packageName: {
    type: String,
    required: true,
  },
  packageType: {
    type: String,
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  numberOfGuests: {
    type: Number,
    required: true,
  },
  specialRequests: String,
  // Payment Details
  subtotal: {
    type: Number,
    required: true,
  },
  vat: {
    type: Number,
    default: 0,
  },
  vatPercentage: {
    type: Number,
    default: 5,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'AED',
  },
  // Stripe Information
  stripePaymentIntentId: {
    type: String,
    required: true,
  },
  stripePaymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded'],
    default: 'pending',
  },
  stripeChargeId: String,
  paymentMethod: String,
  // Order Status
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
    default: 'pending',
  },
  // Metadata
  metadata: {
    type: Map,
    of: String,
  },
  // Timestamps
  paidAt: Date,
  cancelledAt: Date,
  refundedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate order number before saving
OrderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    this.orderNumber = 'ORD-' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 10000);
  }
  this.updatedAt = new Date();
  next();
});

// Indexes for faster queries
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customerEmail: 1 });
OrderSchema.index({ stripePaymentIntentId: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ stripePaymentStatus: 1 });

export const Order = models.Order || model('Order', OrderSchema);
