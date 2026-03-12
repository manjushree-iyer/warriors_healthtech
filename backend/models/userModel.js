const db = require("../db/db");

/**
 * Create a new user in the database
 */
const createUser = async (name, email, password, role) => {
  const result = await db.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email, password, role]
  );
  return result.rows[0];
};

/**
 * Find a user by email
 */
const findUserByEmail = async (email) => {
  const result = await db.query(
    `SELECT * FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );
  return result.rows[0] || null;
};

/**
 * Find a patient user by ABHA ID (joins users + patients)
 */
const findUserByAbhaId = async (abha_id) => {
  const result = await db.query(
    `SELECT u.*, p.abha_id
     FROM users u
     JOIN patients p ON u.id = p.user_id
     WHERE p.abha_id = $1
     LIMIT 1`,
    [abha_id]
  );
  return result.rows[0] || null;
};

/**
 * Find a user by ID
 */
const findUserById = async (id) => {
  const result = await db.query(
    `SELECT id, name, email, role, created_at FROM users WHERE id = $1 LIMIT 1`,
    [id]
  );
  return result.rows[0] || null;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByAbhaId,
  findUserById
};