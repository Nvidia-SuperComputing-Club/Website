import express from 'express';
import HomepageContent from '../models/HomepageContent.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/homepage
router.get('/', async (req, res) => {
  try {
    const sections = await HomepageContent.find({});
    res.json({
      success: true,
      data: sections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message
      }
    });
  }
});

// GET /api/homepage/:section
router.get('/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const validSections = ['hero', 'about', 'stats', 'featured', 'footer'];
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Invalid section name. Must be one of: ${validSections.join(', ')}`
        }
      });
    }

    const content = await HomepageContent.findOne({ section });
    if (!content) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Homepage section '${section}' not found`
        }
      });
    }
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: error.message
      }
    });
  }
});

// PUT /api/homepage/:section
router.put('/:section', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { section } = req.params;
    const validSections = ['hero', 'about', 'stats', 'featured', 'footer'];
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Invalid section name. Must be one of: ${validSections.join(', ')}`
        }
      });
    }

    const content = await HomepageContent.findOneAndUpdate(
      { section },
      { ...req.body, section },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      message: `Homepage section '${section}' updated successfully`,
      data: content
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message
      }
    });
  }
});

export default router;
