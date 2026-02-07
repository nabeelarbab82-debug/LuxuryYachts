import mongoose, { Schema, model, models } from 'mongoose';

const ContentSchema = new Schema({
  section: {
    type: String,
    required: true,
    unique: true,
  },
  title: String,
  subtitle: String,
  description: String,
  content: Schema.Types.Mixed,
  images: [String],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Content = models.Content || model('Content', ContentSchema);
