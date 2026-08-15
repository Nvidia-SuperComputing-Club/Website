import mongoose from 'mongoose';

const membershipApplicationSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  year_major: {
    type: String,
    required: [true, 'Year and major is required'],
    trim: true
  },
  interests: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

membershipApplicationSchema.index({ email: 1 });
membershipApplicationSchema.index({ status: 1 });
membershipApplicationSchema.index({ created_at: -1 });

export default mongoose.model('MembershipApplication', membershipApplicationSchema);
