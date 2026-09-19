const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    icon: {
      type: String,
      default: "⭐",
    },

    category: {
      type: String,
      default: "Personal",
    },

    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },

    reminder: {
      type: String,
      default: "",
    },

    frequency: {
      type: String,
      enum: ["Daily", "Weekly"],
      default: "Daily",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    streak: {
      type: Number,
      default: 0,
    },

    completions: {
      type: Number,
      default: 0,
    },

    history: {
      type: [String],
      default: [],
    },

    lastCompletedDate: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Habit", habitSchema);