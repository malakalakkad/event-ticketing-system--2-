const express = require('express');
const bookingController = require('../controllers/bookingController');
const authenticate = require('../middleware/authenticate');
const eventController = require('../controllers/eventController');
const router = express.Router();
const { getBookingById  } = require('../controllers/bookingController'); 
const { cancelBooking } = require('../controllers/bookingController');
const { authorizeRole } = require('../middleware/authorization');

router.get('/', bookingController.getAllBookings); // Optional if you define it
router.get('/user/:userId', bookingController.getUserBookings); // ✅ FIXED
router.post('/', authenticate, bookingController.createBooking); // ✅ this must be here
router.get('/:id', getBookingById);
router.delete('/:id', authenticate, cancelBooking);
router.delete('/:id', authenticate, authorizeRole('organizer','admin'), eventController.deleteEvent);



module.exports = router;
