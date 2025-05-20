const Event = require('../models/eventModel');

// Create a new event
exports.createEvent = async (req, res) => {
  const { title, description, date, location, availableTickets, price } = req.body;
  const organizer = req.user._id; // organizer must be authenticated
  console.log('req.user:', req.user);

  try {
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      availableTickets,
      price,
      organizer,
      status: 'pending', // default
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Error creating event' });
  }
};

// Get all approved events (public)
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find(); // Show all events
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events' });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching event' });
  }
};

// Update event (organizer only)
exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: 'Error updating event' });
  }
};


// Delete event (organizer only)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // ✅ Compare only if event exists
    if (event.organizer && event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: Not your event' });
    }

    await event.deleteOne(); // or event.remove() if older mongoose
    res.status(200).json({ message: 'Event deleted' });

  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ error: 'Error deleting event' });
  }
};





// Admin: Approve or reject event
exports.updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['approved', 'pending', 'declined'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    event.status = status;
    await event.save();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error updating event status' });
  }
};

