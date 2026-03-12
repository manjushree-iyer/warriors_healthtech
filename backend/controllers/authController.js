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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(
      name,
      email,
      hashedPassword,
      role
    );

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {

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

  res.json({
    user: req.user
  });

};