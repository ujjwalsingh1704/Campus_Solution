import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import User from '../models/user.js';

const router = express.Router();

// Get user's gamification profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('points badges level name');
    
    const profile = {
      name: user.name,
      points: user.points || 0,
      level: user.level || 1,
      badges: user.badges || [],
      nextLevelPoints: (user.level || 1) * 100,
      progressToNextLevel: ((user.points || 0) % 100)
    };

    res.json(profile);
  } catch (error) {
    console.error('Get gamification profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard', authenticateToken, async (req, res) => {
  try {
    const topUsers = await User.find()
      .select('name points level badges role')
      .sort({ points: -1 })
      .limit(10);

    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      points: user.points || 0,
      level: user.level || 1,
      badges: user.badges?.length || 0,
      role: user.role
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available badges
router.get('/badges', authenticateToken, async (req, res) => {
  try {
    const availableBadges = [
      {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Complete 5 tasks before 9 AM',
        icon: '🌅',
        points: 50
      },
      {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Register for 10 events',
        icon: '🦋',
        points: 100
      },
      {
        id: 'foodie',
        name: 'Foodie',
        description: 'Order from canteen 20 times',
        icon: '🍽️',
        points: 75
      },
      {
        id: 'bookworm',
        name: 'Bookworm',
        description: 'Book resources 15 times',
        icon: '📚',
        points: 80
      },
      {
        id: 'perfect_attendance',
        name: 'Perfect Attendance',
        description: 'Maintain 100% attendance for a month',
        icon: '✅',
        points: 200
      }
    ];

    const user = await User.findById(req.user._id).select('badges');
    const userBadges = user.badges || [];

    const badgesWithStatus = availableBadges.map(badge => ({
      ...badge,
      earned: userBadges.includes(badge.id)
    }));

    res.json(badgesWithStatus);
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Award points to user
router.post('/award', authenticateToken, async (req, res) => {
  try {
    const { userId, points, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newPoints = (user.points || 0) + points;
    const newLevel = Math.floor(newPoints / 100) + 1;

    await User.findByIdAndUpdate(userId, {
      points: newPoints,
      level: newLevel
    });

    res.json({
      message: 'Points awarded successfully',
      pointsAwarded: points,
      newTotal: newPoints,
      newLevel,
      reason
    });
  } catch (error) {
    console.error('Award points error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
