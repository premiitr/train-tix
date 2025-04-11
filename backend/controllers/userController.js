const {
  createUser,
  findUserByEmail,
  findUserById,
  getAllBookedSeats,
  updateUserSeats,
  resetAllBookings
} = require('../models/userModel');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await findUserByEmail(email);
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const newUser = await createUser({ name, email, password });
    res.status(201).json({
      message: 'User registered',
      user_id: newUser.id,
      name: newUser.name,
      email: newUser.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.password !== password) return res.status(401).json({ error: 'Invalid password' });

    res.json({
      message: 'Login successful',
      user_id: user.id,
      name: user.name,
      email: user.email,
      booked_seats : user.booked_seats
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.bookSeats = async (req, res) => {
  const { user_id, seats } = req.body;
  if (!user_id || !seats) return res.status(400).json({ error: 'Missing user_id or seats' });

  try {
    const user = await findUserById(user_id);
    const allSeats = await getAllBookedSeats();

    const conflict = seats.some(s => allSeats.includes(s) && !user.booked_seats.includes(s));
    if (conflict) return res.status(400).json({ error: 'Some seats are already booked' });

    const updated = [...new Set([...user.booked_seats, ...seats])];
    await updateUserSeats(user_id, updated);

    res.json({ message: 'Seats booked', booked_seats: updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.cancelSeats = async (req, res) => {
  const { user_id, seats } = req.body;
  if (!user_id || !seats) return res.status(400).json({ error: 'Missing user_id or seats' });

  try {
    const user = await findUserById(user_id);
    const updated = user.booked_seats.filter(seat => !seats.includes(seat));
    await updateUserSeats(user_id, updated);

    res.json({ message: 'Seats cancelled', booked_seats: updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.resetAll = async (req, res) => {
  const { user_id } = req.body;
  try {
    const user = await findUserById(user_id);
    if (user.email !== 'admin@traintix.com') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await resetAllBookings();
    res.json({ message: 'All bookings reset' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getBookedSeats = async (_req, res) => {
  try {
    const seats = await getAllBookedSeats();
    res.json({ booked_seats: seats });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
