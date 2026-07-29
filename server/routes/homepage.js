import express from 'express';
const router = express.Router();

const mockHomepage = [
  {
    id: 'hero-section',
    section: 'hero',
    title: 'NVIDIA Super Computing Club',
    subtitle: 'Building the future with GPU computing',
    body: {
      cta_text: 'Join Us',
      cta_link: '/events'
    },
    image_url: ''
  },
  {
    id: 'about-section',
    section: 'about',
    title: 'About Us',
    body: {
      paragraphs: [
        'We are a student organization dedicated to supercomputing, GPU acceleration, and artificial intelligence.'
      ]
    }
  }
];

// GET /api/homepage
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: mockHomepage
  });
});

// GET /api/homepage/:section
router.get('/:section', (req, res) => {
  const sectionContent = mockHomepage.find(h => h.section === req.params.section);
  if (!sectionContent) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Homepage section '${req.params.section}' not found`
      }
    });
  }
  res.json({
    success: true,
    data: sectionContent
  });
});

// PUT /api/homepage/:section
router.put('/:section', (req, res) => {
  res.json({
    success: true,
    message: `Homepage section '${req.params.section}' updated successfully (Mock Stub)`,
    data: { section: req.params.section, ...req.body }
  });
});

export default router;
