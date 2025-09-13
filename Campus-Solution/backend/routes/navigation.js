import express from 'express';
import { authenticateToken, optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get campus map
router.get('/map', optionalAuth, async (req, res) => {
  try {
    const campusMap = {
      buildings: [
        {
          id: 'main_building',
          name: 'Main Academic Building',
          coordinates: { lat: 28.6139, lng: 77.2090 },
          floors: 4,
          facilities: ['Classrooms', 'Faculty Offices', 'Admin Office']
        },
        {
          id: 'library',
          name: 'Central Library',
          coordinates: { lat: 28.6140, lng: 77.2085 },
          floors: 3,
          facilities: ['Reading Halls', 'Digital Library', 'Study Rooms']
        },
        {
          id: 'canteen',
          name: 'Student Canteen',
          coordinates: { lat: 28.6135, lng: 77.2095 },
          floors: 1,
          facilities: ['Food Court', 'Seating Area']
        },
        {
          id: 'sports_complex',
          name: 'Sports Complex',
          coordinates: { lat: 28.6145, lng: 77.2100 },
          floors: 2,
          facilities: ['Gymnasium', 'Indoor Courts', 'Swimming Pool']
        }
      ],
      paths: [
        {
          from: 'main_building',
          to: 'library',
          distance: 150,
          walkingTime: 2
        },
        {
          from: 'main_building',
          to: 'canteen',
          distance: 200,
          walkingTime: 3
        }
      ]
    };

    res.json(campusMap);
  } catch (error) {
    console.error('Get campus map error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get directions between two points
router.post('/directions', optionalAuth, async (req, res) => {
  try {
    const { from, to } = req.body;

    const mockDirections = {
      from,
      to,
      distance: '250 meters',
      walkingTime: '3 minutes',
      steps: [
        'Exit the Main Building from the front entrance',
        'Walk straight for 100 meters',
        'Turn right at the fountain',
        'Continue for 150 meters',
        `You will reach ${to}`
      ]
    };

    res.json(mockDirections);
  } catch (error) {
    console.error('Get directions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get points of interest
router.get('/pois', optionalAuth, async (req, res) => {
  try {
    const pois = [
      {
        id: '1',
        name: 'ATM',
        category: 'finance',
        location: 'Near Main Entrance',
        coordinates: { lat: 28.6138, lng: 77.2088 }
      },
      {
        id: '2',
        name: 'Medical Center',
        category: 'health',
        location: 'Ground Floor, Main Building',
        coordinates: { lat: 28.6139, lng: 77.2089 }
      },
      {
        id: '3',
        name: 'Parking Area',
        category: 'transport',
        location: 'Behind Sports Complex',
        coordinates: { lat: 28.6147, lng: 77.2102 }
      },
      {
        id: '4',
        name: 'Wi-Fi Hotspot',
        category: 'technology',
        location: 'Library Entrance',
        coordinates: { lat: 28.6140, lng: 77.2084 }
      }
    ];

    res.json(pois);
  } catch (error) {
    console.error('Get POIs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update POI (admin only)
router.put('/pois/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Mock update
    res.json({
      message: 'POI updated successfully',
      poi: { id, ...updates }
    });
  } catch (error) {
    console.error('Update POI error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
