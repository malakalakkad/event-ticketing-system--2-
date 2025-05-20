const Booking = require('../models/bookingModel');
const Event = require('../models/eventModel');

// ✅ Create a new booking
const createBooking = async (req, res) => {
  try {
    const user = req.user._id; // Assumes middleware sets req.user
    const { eventId, quantity } = req.body;

    if (!eventId || !quantity) {
      return res.status(400).json({ error: 'Missing eventId or quantity' });
    }

    const eventDetails = await Event.findById(eventId);
    if (!eventDetails) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const totalPrice = eventDetails.price * quantity;

    const newBooking = new Booking({
      user,
      event: eventId,
      tickets: quantity,
      totalPrice
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get all bookings (admin/debug)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')       // Optional: populate user info
      .populate('event', 'title date price'); // Optional: populate event info
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get bookings for a specific user
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate('event', 'title date price');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    console.log(`Attempting to cancel booking with ID: ${bookingId}`); // Log the booking ID

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.log(`Booking with ID ${bookingId} not found`); // Log if booking is not found
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Log booking details
    console.log(`Found booking: ${JSON.stringify(booking)}`);

    // Use deleteOne instead of remove()
    await booking.deleteOne();  // Cancel the booking
    console.log(`Booking with ID ${bookingId} canceled successfully`); // Log successful cancelation

    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (err) {
    console.error('Error canceling booking:', err); // Log full error details
    res.status(500).json({ message: 'Error canceling booking', error: err.message });
  }
};


// ✅ Export all controller functions
module.exports = {
  createBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking,
  getBookingById,
};
