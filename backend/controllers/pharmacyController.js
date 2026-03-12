const pool = require("../db/db");

// SEARCH MEDICINE
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


// ADD MEDICINE TO INVENTORY
exports.addMedicine = async (req, res) => {

  const { pharmacy_id, medicine_id, stock, price } = req.body;

  try {

    const result = await pool.query(
      `INSERT INTO pharmacy_inventory 
       (pharmacy_id, medicine_id, stock, price)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [pharmacy_id, medicine_id, stock, price]
    );

    res.json({
      success: true,
      message: "Medicine added to inventory",
      data: result.rows[0]
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};

// UPDATE MEDICINE STOCK
exports.updateStock = async (req, res) => {

  const { id } = req.params;
  const { stock } = req.body;

  try {

    const result = await pool.query(
      `UPDATE pharmacy_inventory
       SET stock = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [stock, id]
    );

    // LOW STOCK ALERT
    if (stock < 10) {
      console.log("⚠️ LOW STOCK ALERT for inventory id:", id);
    }

    res.json({
      success: true,
      message: "Stock updated",
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }

};