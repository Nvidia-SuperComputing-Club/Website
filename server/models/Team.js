import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Member name is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Member role is required'],
    trim: true
  },
  bio: {
    type: String,
    default: ''
  },
  image_url: {
    type: String,
    default: ''
  },
  github_url: {
    type: String,
    default: ''
  },
  linkedin_url: {
    type: String,
    default: ''
  },
  twitter_url: {
    type: String,
    default: ''
  },
  display_order: {
    type: Number,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

teamSchema.index({ display_order: 1 });
teamSchema.index({ is_active: 1 });

export default mongoose.model('Team', teamSchema);
