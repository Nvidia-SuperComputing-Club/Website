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
import applicationsRouter from './routes/applications.js';
import dashboardRouter from './routes/dashboard.js';

dotenv.config();

connectDB();

const app = express();

app.use(helmet());

const normalizeOrigin = (origin) => {
  if (typeof origin !== 'string') return origin
  return origin.replace(/\/+$/, '')
}

const corsOptions = {
  origin: (origin, callback) => {
    const allowed = process.env.CORS_ORIGIN || 'http://localhost:5173'
    const normalizedAllowed = normalizeOrigin(allowed)
    if (!origin || normalizeOrigin(origin) === normalizedAllowed) {
      callback(null, true)
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`))
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

app.use('/api/events', eventsRouter);
app.use('/api/team', teamRouter);
app.use('/api/homepage', homepageRouter);
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'NVIDIA Super Computing Club Server is Healthy!' });
});

app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'API route not found',
    },
  });
});

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
