import express from 'express';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import Event from '../models/Event.js';
import Team from '../models/Team.js';
import Application from '../models/MembershipApplication.js';

const router = express.Router();

router.get('/stats', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const now = new Date();
    const [totalEvents, activeTeam, upcomingEvents, pendingApps] = await Promise.all([
      Event.countDocuments(),
      Team.countDocuments({ is_active: true }),
      Event.countDocuments({ date: { $gte: now } }),
      Application.countDocuments({ status: 'pending' })
    ]);

    res.json({
      success: true,
      data: {
        events: totalEvents,
        team: activeTeam,
        upcoming: upcomingEvents,
        applications: pendingApps
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

router.get('/applications', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const applications = await Application.find({})
      .sort({ created_at: -1 })
      .limit(5)
      .select('id full_name email created_at status');

    res.json({
      success: true,
      data: applications
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
