const express = require("express");
const router = express.Router();

const User = require("../models/User");

// Get user
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Create / Update Premium status
router.put("/:email/premium", async (req, res) => {
  try {
    const { isPremium } = req.body;

    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { isPremium },
      { new: true, upsert: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;