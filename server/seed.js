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
        title: 'Galgotias NVIDIA DGX H200 AI Sprint 2026',
        description: '24-hour GPU coding sprint to optimize LLM training kernels on the DGX H200 node.',
        date: new Date('2026-09-01T09:00:00Z'),
        location: 'Galgotias University C-Block Auditorium',
        image_url: '',
        category: 'hackathon',
        is_featured: true
      },
      {
        title: 'CUDA Optimization and Parallel Programming Workshop',
        description: 'Learn warp divergence elimination and shared memory allocation in CUDA C++. Hands-on sessions with NVIDIA Nsight tools.',
        date: new Date('2026-10-15T14:30:00Z'),
        location: 'C-Block Lab 302',
        image_url: '',
        category: 'workshop',
        is_featured: true
      },
      {
        title: 'Deep Learning Institute: LLM Quantization Sprints',
        description: 'Implement AWQ and GPTQ quantization on custom Llama-3 models using NVIDIA TensorRT and TRT-LLM.',
        date: new Date('2026-11-10T10:00:00Z'),
        location: 'Online / Hybrid',
        image_url: '',
        category: 'talk',
        is_featured: false
      }
    ]);
    console.log('Events seeded:', events.length);

    const teamMembers = await Team.insertMany([
      {
        name: 'Daksh Pratap Singh',
        role: 'Club President / NVIDIA Ambassador',
        bio: 'Student engineer specializing in CUDA-based high-performance computing, GPU memory design, and parallel architectures. Focuses on research in accelerating sparse matrix operations.',
        image_url: '',
        github_url: 'https://github.com/daxforge',
        linkedin_url: 'https://linkedin.com/in/daksh-pratap',
        twitter_url: '',
        display_order: 1,
        is_active: true
      },
      {
        name: 'Alwin Mathew',
        role: 'Vice President & Lead 3D Developer',
        bio: 'Creative technologist and frontend engineer. Deep interest in WebGL, Three.js, shaders, and creating immersive 3D user experiences on the web.',
        image_url: '',
        github_url: 'https://github.com/alwin2134',
        linkedin_url: 'https://linkedin.com/in/alwin-mathew',
        twitter_url: '',
        display_order: 2,
        is_active: true
      },
      {
        name: 'Preet Biswas',
        role: 'Backend & Systems Infrastructure Lead',
        bio: 'Systems programmer and backend engineer. Focuses on RESTful and GraphQL API services, Postgres database optimization, Docker deployment, and cloud pipelines.',
        image_url: '',
        github_url: 'https://github.com/preetbiswas12',
        linkedin_url: 'https://linkedin.com/in/preet-biswas',
        twitter_url: '',
        display_order: 3,
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
