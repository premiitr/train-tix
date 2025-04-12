const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432, // Render uses 5432 by default
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
