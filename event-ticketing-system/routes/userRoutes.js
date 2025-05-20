const express = require('express');
const router = express.Router();

const {
  getUsers,
  updateProfile,
  getProfile,
  getUserById,
  updateUserRole,
  deleteUser,
  getEventAnalytics, // Analytics function imported from the controller
} = require('../controllers/userController');

const authenticate = require('../middleware/authenticate');
const { authorizeRole } = require('../middleware/authorization');

// GET /api/v1/users/profile → current user
router.get('/profile', authenticate, getProfile);

// PUT /api/v1/users/profile → update profile
router.put('/profile', authenticate, updateProfile);

// GET /api/v1/users → admin only
router.get('/', authenticate, authorizeRole('admin'), getUsers);

// GET /api/v1/users/:id → admin only
router.get('/:id', authenticate, authorizeRole('admin'), getUserById);

// PUT /api/v1/users/:id → admin only
router.put('/:id', authenticate, authorizeRole('admin'), updateUserRole);

// DELETE /api/v1/users/:id → admin only
router.delete('/:id', authenticate, authorizeRole('admin'), deleteUser);

// GET /api/v1/users/events/analytics → event organizer's event analytics
router.get('/events/analytics',authenticate, authorizeRole('organizer'), getEventAnalytics );

module.exports = router;
