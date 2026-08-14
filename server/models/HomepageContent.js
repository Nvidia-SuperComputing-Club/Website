import mongoose from 'mongoose';

const homepageContentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: [true, 'Section name is required'],
    enum: ['hero', 'about', 'stats', 'featured', 'footer'],
    unique: true
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  body: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  image_url: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('HomepageContent', homepageContentSchema);
