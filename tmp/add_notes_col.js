require('dotenv').config({ path: '../backend/.env' });
const { Pool } = require('pg');

async function run() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Adding notes column to appointments...");
    await pool.query("ALTER TABLE appointments ADD COLUMN IF NOT EXISTS notes TEXT;");
    console.log("Success!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

run();
