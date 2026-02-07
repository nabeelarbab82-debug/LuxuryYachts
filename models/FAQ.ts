import mongoose, { Schema, model, models } from 'mongoose';

const FAQSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export const FAQ = models.FAQ || model('FAQ', FAQSchema);
