const User = require('../models/userModel');
const Event = require('../models/eventModel');
const Booking = require('../models/bookingModel');

exports.getUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.getProfile = async (req, res) => {
  res.json(req.user); // already fetched by authenticate middleware
};

exports.updateProfile = async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
  res.json(user);
};
exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User role updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEventAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const events = await Event.find({ organizer: userId });
    const eventIds = events.map(e => e._id);

    const bookings = await Booking.find({ event: { $in: eventIds } });

    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const totalTickets = bookings.reduce((sum, b) => sum + b.tickets, 0);

    res.json({
      totalEvents: events.length,
      totalTicketsSold: totalTickets,
      totalRevenue
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

