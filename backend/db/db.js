<<<<<<< HEAD
const { Pool } = require('pg');
=======
const { Pool } = require("pg");
>>>>>>> backend-consultation

const pool = new Pool({
  user: "postgres",
  host: "localhost",
<<<<<<< HEAD
  database: "telehealth",
  password: "1234",
=======
  database: "healthtech",
  password: "password",
>>>>>>> backend-consultation
  port: 5432
});

module.exports = pool;