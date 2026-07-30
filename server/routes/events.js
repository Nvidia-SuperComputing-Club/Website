import express from 'express';
const router = express.Router();

// Mock initial data
const mockEvents = [
  {
    id: 'events-1',
    title: 'CUDA Workshop Series',
    description: 'Hands-on CUDA programming workshop',
    date: '2026-08-15T18:00:00Z',
    location: 'Room 301, CS Building',
    image_url: '',
    category: 'workshop',
    is_featured: true,
    created_at: '2026-07-01T10:00:00Z'
  },
  {
    id: 'events-2',
    title: 'AI Supercomputing Challenge',
    description: 'Train deep learning models on cluster environments to solve complex real-world issues.',
    date: '2026-09-10T09:00:00Z',
    location: 'Main Exhibition Hall',
    image_url: '',
    category: 'hackathon',
    is_featured: false,
    created_at: '2026-07-05T12:00:00Z'
  }
];

// GET /api/events
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: mockEvents,
    pagination: {
      page: 1,
      limit: 10,
      total: mockEvents.length,
      pages: 1
    }
  });
});

// GET /api/events/:id
router.get('/:id', (req, res) => {
  const event = mockEvents.find(e => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Event not found'
      }
    });
  }
  res.json({
    success: true,
    data: event
  });
});

// POST /api/events
router.post('/', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Event created successfully (Mock Stub)',
    data: { id: 'new-event-id', ...req.body }
  });
});

// PUT /api/events/:id
router.put('/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Event updated successfully (Mock Stub)',
    data: { id: req.params.id, ...req.body }
  });
});

// DELETE /api/events/:id
router.delete('/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Event deleted successfully (Mock Stub)'
  });
});

export default router;
