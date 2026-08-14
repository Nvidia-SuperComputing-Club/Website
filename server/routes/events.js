import express from 'express';
import Event from '../models/Event.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/events
router.get('/', async (req, res) => {
  try {
    const {
      category,
      featured,
      upcoming,
      page = 1,
      limit = 10,
      sort = 'date'
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (featured !== undefined) query.is_featured = featured === 'true';
    if (upcoming === 'true') query.date = { $gte: new Date() };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOption = {};
    sortOption[sort] = 1;

    const [data, total] = await Promise.all([
      Event.find(query).sort(sortOption).skip(skip).limit(parseInt(limit)),
      Event.countDocuments(query)
    ]);

    res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
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

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Event not found'
        }
      });
    }
    res.json({ success: true, data: event });
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

// POST /api/events
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
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

// PUT /api/events/:id
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
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
      message: 'Event updated successfully',
      data: event
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

// DELETE /api/events/:id
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
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
      message: 'Event deleted successfully'
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

export default router;
