import express from 'express';
import Application from '../models/MembershipApplication.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { full_name, email, year_major, interests } = req.body;

    if (!full_name || !email || !year_major) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Full name, email, and year/major are required'
        }
      });
    }

    const application = await Application.create({
      full_name,
      email,
      year_major,
      interests: interests || [],
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
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
