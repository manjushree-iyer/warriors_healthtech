const pool = require("./db/db");

async function testDB() {
  try {
    const res = await pool.query("SELECT * FROM medicines");
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  }
}

testDB();