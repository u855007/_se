const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

// PostgreSQL connection config
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  port: 5432,
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/count', async (req, res) => {
  try {
    // Increment counter
    await pool.query('UPDATE counters SET count = count + 1 WHERE id = 1');
    // Fetch current count
    const result = await pool.query('SELECT count FROM counters WHERE id = 1');
    res.json({ count: result.rows[0].count });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
