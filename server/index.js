import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import eventsRouter from './routes/events.js';
import teamRouter from './routes/team.js';
import homepageRouter from './routes/homepage.js';
import authRouter from './routes/auth.js';
import uploadRouter from './routes/upload.js';

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security Middlewares
app.use(helmet());

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Mount API Routes
app.use('/api/events', eventsRouter);
app.use('/api/team', teamRouter);
app.use('/api/homepage', homepageRouter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);

// Root/health check route
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'NVIDIA Super Computing Club Server is Healthy!' });
});

// Custom 404 Route for /api/*
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'API route not found',
    },
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: 'SERVER_ERROR',
      message: err.message || 'Internal Server Error',
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
