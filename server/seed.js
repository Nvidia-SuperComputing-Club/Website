import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from './models/Event.js';
import Team from './models/Team.js';
import HomepageContent from './models/HomepageContent.js';
import AdminUser from './models/AdminUser.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nvidia-sc-website');
    console.log('MongoDB Connected for seeding...');

    await AdminUser.deleteMany({});
    await Event.deleteMany({});
    await Team.deleteMany({});
    await HomepageContent.deleteMany({});

    const admin = await AdminUser.create({
      email: 'official.nvidiaaiclub@gmail.com',
      full_name: 'Admin User',
      password: 'nvidia',
      role: 'admin'
    });
    console.log('Admin user created:', admin.email);

    const events = await Event.insertMany([
      {
        title: 'CUDA Workshop Series',
        description: 'Hands-on CUDA programming workshop for beginners and intermediates.',
        date: new Date('2026-08-15T18:00:00Z'),
        location: 'Room 301, CS Building',
        image_url: '',
        category: 'workshop',
        is_featured: true
      },
      {
        title: 'AI Supercomputing Challenge',
        description: 'Train deep learning models on cluster environments to solve complex real-world issues.',
        date: new Date('2026-09-10T09:00:00Z'),
        location: 'Main Exhibition Hall',
        image_url: '',
        category: 'hackathon',
        is_featured: false
      }
    ]);
    console.log('Events seeded:', events.length);

    const teamMembers = await Team.insertMany([
      {
        name: 'Alex Chen',
        role: 'Club President',
        bio: 'CS major specializing in distributed systems and HPC.',
        image_url: '',
        github_url: 'https://github.com/alexchen',
        linkedin_url: 'https://linkedin.com/in/alexchen',
        twitter_url: 'https://x.com/alexchen',
        display_order: 1,
        is_active: true
      },
      {
        name: 'Sarah Jenkins',
        role: 'AI Lead',
        bio: 'Research assistant focusing on large language models and distributed training.',
        image_url: '',
        github_url: 'https://github.com/sarahj',
        linkedin_url: 'https://linkedin.com/in/sarahj',
        twitter_url: '',
        display_order: 2,
        is_active: true
      }
    ]);
    console.log('Team members seeded:', teamMembers.length);

    const homepageSections = await HomepageContent.insertMany([
      {
        section: 'hero',
        title: 'NVIDIA Super Computing Club',
        subtitle: 'Building the future with GPU computing',
        body: { cta_text: 'Join Us', cta_link: '/events' },
        image_url: ''
      },
      {
        section: 'about',
        title: 'About Us',
        body: {
          paragraphs: [
            'We are a student organization dedicated to supercomputing, GPU acceleration, and artificial intelligence.'
          ]
        }
      }
    ]);
    console.log('Homepage sections seeded:', homepageSections.length);

    console.log('Seed data completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
