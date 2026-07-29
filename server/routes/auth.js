import express from 'express';
const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { provider } = req.body;
  res.json({
    success: true,
    data: {
      url: `https://mock-auth-provider.com/auth/${provider || 'google'}?callback=http://localhost:5000/api/auth/callback`
    }
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  res.json({
    success: true,
    data: {
      id: 'mock-admin-id',
      email: 'admin@university.edu',
      full_name: 'Administrator',
      role: 'admin'
    }
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default router;
