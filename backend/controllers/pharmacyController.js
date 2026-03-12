const pool = require("../db/db");

exports.searchMedicine = async (req, res) => {
  const { medicine } = req.query;

  try {

    const result = await pool.query(
      `SELECT 
        m.name,
        p.pharmacy_id,
        p.stock,
        p.price
       FROM medicines m
       JOIN pharmacy_inventory p
       ON m.id = p.medicine_id
       WHERE LOWER(m.name) LIKE LOWER($1)`,
      [`%${medicine}%`]
    );

    res.json({
      success: true,
      medicines: result.rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};