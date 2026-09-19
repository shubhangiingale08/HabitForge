const express = require("express");
const Habit = require("../models/Habit");

const {
  calculateStreak,
  getTodayDate,
  calculateXP,
  calculateLevel,
  getAchievements,
} = require("../utils/gamification");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// --------------------------------------------------
// GET ALL HABITS
// --------------------------------------------------

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const habits = await Habit.find({
      userId: userId,
    }).sort({
      createdAt: -1,
    });

    res.json(habits);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// --------------------------------------------------
// CREATE HABIT
// --------------------------------------------------

router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const habit = new Habit({
      ...req.body,
      userId: userId,
    });

    const savedHabit = await habit.save();

    res.status(201).json(savedHabit);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// --------------------------------------------------
// UPDATE / COMPLETE HABIT
// --------------------------------------------------

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { completed } = req.body;

    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: userId,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    // ----------------------------------------------
    // COMPLETE HABIT
    // ----------------------------------------------

    if (completed === true && habit.completed !== true) {
      const today = getTodayDate();

      const newStreak = calculateStreak(
        habit.lastCompletedDate,
        today,
        habit.streak || 0
      );

      const newCompletions =
        (habit.completions || 0) + 1;

      habit.completed = true;
      habit.streak = newStreak;
      habit.completions = newCompletions;
      habit.lastCompletedDate = today;

      if (!habit.history.includes(today)) {
        habit.history.push(today);
      }
    }

    // ----------------------------------------------
    // MARK HABIT INCOMPLETE
    // ----------------------------------------------

    if (completed === false) {
      habit.completed = false;
    }

    const updatedHabit = await habit.save();

    // ----------------------------------------------
    // USER GAMIFICATION DATA
    // ----------------------------------------------

    const allHabits = await Habit.find({
      userId: userId,
    });

    const totalCompletions = allHabits.reduce(
      (total, item) =>
        total + (item.completions || 0),
      0
    );

    const bestStreak = Math.max(
      0,
      ...allHabits.map(
        (item) => item.streak || 0
      )
    );

    const achievements = getAchievements(
      totalCompletions,
      bestStreak
    );

    const totalXP = calculateXP(totalCompletions);
    const totalLevel = calculateLevel(totalXP);

    res.json({
      ...updatedHabit.toObject(),
      xp: totalXP,
      level: totalLevel,
      achievements,
    });
  } catch (error) {
    console.error("❌ Update habit error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
});

// --------------------------------------------------
// DELETE HABIT
// --------------------------------------------------

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const deletedHabit =
      await Habit.findOneAndDelete({
        _id: req.params.id,
        userId: userId,
      });

    if (!deletedHabit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    res.json({
      message: "Habit deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// --------------------------------------------------
// EXPORT ROUTER
// --------------------------------------------------

module.exports = router;