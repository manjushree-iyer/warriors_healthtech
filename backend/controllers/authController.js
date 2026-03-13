const bcrypt = require("bcrypt");
const generateToken = require("../config/jwt");

// DB functions will come from your teammate
const {
  createUser,
  findUserByEmail,
  findUserByAbhaId
} = require("../models/userModel");


exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in 'users' table
    const user = await createUser(
      name,
      email,
      hashedPassword,
      role
    );

    // Automatically create profile in relevant sub-table
    const db = require("../db/db");
    if (role === "patient") {
      const abhaPlaceholder = Math.floor(10000000000000 + Math.random() * 90000000000000).toString();
      await db.query(
        "INSERT INTO patients (user_id, abha_id) VALUES ($1, $2)",
        [user.id, abhaPlaceholder]
      );
    } else if (role === "doctor") {
      await db.query(
        "INSERT INTO doctors (user_id, specialization, hospital) VALUES ($1, $2, $3)",
        [user.id, "General Physician", "City Hospital"]
      );
    } else if (role === "pharmacy") {
      await db.query(
        "INSERT INTO pharmacies (user_id, location) VALUES ($1, $2)",
        [user.id, "Main Street"]
      );
    }

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
};



exports.login = async (req, res) => {

  try {

    let user;

    // Patient login using ABHA ID
    if (req.body.abha_id) {

      user = await findUserByAbhaId(req.body.abha_id);

    }

    // Doctor/Pharmacy login using email
    else {

      user = await findUserByEmail(req.body.email);

    }

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {

      return res.status(401).json({
        message: "Invalid password"
      });

    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {

    res.status(500).json({
      message: "Login failed",
      error: error.message
    });

  }

};



exports.me = async (req, res) => {
  try {
    const user = req.user;
    let profile = {};
    const db = require("../db/db");

    if (user.role === "patient") {
      const resp = await db.query("SELECT * FROM patients WHERE user_id = $1", [user.id]);
      profile = resp.rows[0] || {};
    } else if (user.role === "doctor") {
      const resp = await db.query("SELECT * FROM doctors WHERE user_id = $1", [user.id]);
      profile = resp.rows[0] || {};
    } else if (user.role === "pharmacy") {
      const resp = await db.query("SELECT * FROM pharmacies WHERE user_id = $1", [user.id]);
      profile = resp.rows[0] || {};
    }

    res.json({
      user: {
        ...user,
        profile
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};