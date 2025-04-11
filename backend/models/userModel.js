const pool = require('../db');

const createUser = async ({ name, email, password, role }) => {
  const result = await pool.query(
    'INSERT INTO users (name, email, password, role, booked_seats) VALUES ($1, $2, $3, $4, $5) RETURNING id, role',
    [name, email, password, role || 'customer', []]
  );
  return result.rows[0];
};


const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const getAllBookedSeats = async () => {
  const result = await pool.query('SELECT booked_seats FROM users');
  const allSeats = result.rows.flatMap(r => r.booked_seats || []);
  return [...new Set(allSeats)];
};

const updateUserSeats = async (id, seats) => {
  const result = await pool.query(
    'UPDATE users SET booked_seats = $1 WHERE id = $2 RETURNING *',
    [seats, id]
  );
  return result.rows[0];
};

const resetAllBookings = async () => {
  await pool.query('UPDATE users SET booked_seats = $1', [[]]);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  getAllBookedSeats,
  updateUserSeats,
  resetAllBookings
};
