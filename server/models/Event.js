import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true
  },
  image_url: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['hackathon', 'workshop', 'talk', 'meetup', 'other'],
    default: 'other'
  },
  is_featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  id: true
});

eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ is_featured: 1 });

export default mongoose.model('Event', eventSchema);
