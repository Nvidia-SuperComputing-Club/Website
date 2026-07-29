import express from 'express';
const router = express.Router();

// POST /api/upload
router.post('/', (req, res) => {
  res.status(201).json({
    success: true,
    data: {
      url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/mock-image.webp',
      path: 'events/mock-image.webp'
    },
    message: 'File uploaded successfully (Mock Stub)'
  });
});

export default router;
