import express from 'express';
const router = express.Router();

const mockTeam = [
  {
    id: 'team-1',
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
    id: 'team-2',
    name: 'Sarah Jenkins',
    role: 'AI Lead',
    bio: 'Research assistant focusing on large language models and distributed training.',
    image_url: '',
    github_url: 'https://github.com/sarahj',
    linkedin_url: 'https://linkedin.com/in/sarahj',
    twitter_url: null,
    display_order: 2,
    is_active: true
  }
];

// GET /api/team
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: mockTeam
  });
});

// GET /api/team/:id
router.get('/:id', (req, res) => {
  const member = mockTeam.find(m => m.id === req.params.id);
  if (!member) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Team member not found'
      }
    });
  }
  res.json({
    success: true,
    data: member
  });
});

// POST /api/team
router.post('/', (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Team member added successfully (Mock Stub)',
    data: { id: 'new-member-id', ...req.body }
  });
});

// PUT /api/team/:id
router.put('/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Team member updated successfully (Mock Stub)',
    data: { id: req.params.id, ...req.body }
  });
});

// DELETE /api/team/:id
router.delete('/:id', (req, res) => {
  res.json({
    success: true,
    message: 'Team member removed successfully (Mock Stub)'
  });
});

export default router;
