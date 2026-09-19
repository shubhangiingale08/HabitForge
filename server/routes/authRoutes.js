const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = new User({
      name,
      email,
      password,
    });

    const savedUser = await user.save();

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        isPremium: savedUser.isPremium,
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare entered password with hashed password
    let isPasswordCorrect = false;

if (
  user.password.startsWith("$2a$") ||
  user.password.startsWith("$2b$") ||
  user.password.startsWith("$2y$")
) {
  // Already hashed password
  isPasswordCorrect = await user.comparePassword(password);
} else {
  // Old plaintext password
  isPasswordCorrect = user.password === password;

  // Convert old password into hashed password
  if (isPasswordCorrect) {
    user.password = password;
    await user.save();
  }
}

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

    res.json({
  message: "Login successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    isPremium: user.isPremium,
  },
});
  } catch (error) {
    console.error("❌ Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;