const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController'); // this line was missing
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  updateEventStatus
} = eventController;

const authenticate = require('../middleware/authenticate');
const { isOrganizer, isAdmin, authorizeRole } = require('../middleware/authorization');





router.post('/', authenticate, isOrganizer, eventController.createEvent);
router.get('/', eventController.getAllEvents);

// Anyone can view all events
router.get('/list', eventController.getAllEvents);

// Anyone can view one event
router.get('/:id', eventController.getEventById);

// Only organizers can create an event
router.post('/create', authenticate, isOrganizer, eventController.createEvent);
router.put('/:id', authenticate, authorizeRole('organizer', 'admin'), updateEvent);

// Only organizers can update their own event
router.put('/:id/edit', authenticate, isOrganizer, eventController.updateEvent);



// Only admins can approve or reject events
router.put('/:id/approve', authenticate, isAdmin, eventController.updateEventStatus);

router.delete('/:id', authenticate, isOrganizer, eventController.deleteEvent);


 

// (Optional) Only organizers can view analytics
// router.get('/analytics', authenticate, isOrganizer, eventController.getAnalytics);

module.exports = router;

