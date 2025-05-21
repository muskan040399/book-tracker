const { Pool } = require('pg');         // Capital P
require('dotenv').config();             // Load .env before using env variables

const pool = new Pool({                 // Now pool is properly initialized
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;                  // Export the initialized pool
