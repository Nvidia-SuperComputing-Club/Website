import express from 'express';
import Team from '../models/Team.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/team
router.get('/', async (req, res) => {
  try {
    const { active, page = 1, limit = 20 } = req.query;

    const query = {};
    if (active !== undefined) {
      query.is_active = active === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [data, total] = await Promise.all([
      Team.find(query).sort({ display_order: 1 }).skip(skip).limit(parseInt(limit)),
      Team.countDocuments(query)
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

// GET /api/team/:id
router.get('/:id', async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Team member not found'
        }
      });
    }
    res.json({ success: true, data: member });
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

// POST /api/team
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const member = await Team.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Team member added successfully',
      data: member
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

// PUT /api/team/:id
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const member = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
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
      message: 'Team member updated successfully',
      data: member
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

// DELETE /api/team/:id (soft delete)
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const member = await Team.findByIdAndUpdate(req.params.id, { is_active: false }, { new: true });
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
      message: 'Team member soft deleted successfully'
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
