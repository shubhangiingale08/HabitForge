const mongoose = require("mongoose");
require("dotenv").config();

const Habit = require("../models/Habit");

const seedDemoData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    // Remove old demo habits
    await Habit.deleteMany({
      name: {
        $in: [
          "Morning Exercise",
          "Read for 30 Minutes",
          "Practice Coding",
          "Drink Enough Water",
        ],
      },
    });

    const habits = [
      {
        name: "Morning Exercise",
        icon: "💪",
        category: "Health",
        priority: "High",
        reminder: "07:00",
        frequency: "Daily",
        completed: true,
        streak: 12,
        completions: 65,
        history: [],
        lastCompletedDate: null,
      },
      {
        name: "Read for 30 Minutes",
        icon: "📚",
        category: "Study",
        priority: "Medium",
        reminder: "20:00",
        frequency: "Daily",
        completed: true,
        streak: 8,
        completions: 48,
        history: [],
        lastCompletedDate: null,
      },
      {
        name: "Practice Coding",
        icon: "💻",
        category: "Study",
        priority: "High",
        reminder: "18:00",
        frequency: "Daily",
        completed: true,
        streak: 15,
        completions: 72,
        history: [],
        lastCompletedDate: null,
      },
      {
        name: "Drink Enough Water",
        icon: "🥤",
        category: "Health",
        priority: "Medium",
        reminder: "10:00",
        frequency: "Daily",
        completed: true,
        streak: 6,
        completions: 55,
        history: [],
        lastCompletedDate: null,
      },
    ];

    // Generate approximately 3 months of completion history
    habits.forEach((habit) => {
      const history = [];

      for (let i = 0; i < 90; i++) {
        const date = new Date();

        date.setDate(date.getDate() - i);

        // Create realistic gaps in completion history
        if (Math.random() > 0.25) {
          const dateString =
            date.getFullYear() +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(date.getDate()).padStart(2, "0");

          history.push(dateString);
        }
      }

      habit.history = [...new Set(history)];

      habit.lastCompletedDate =
        habit.history[0] || null;
    });

    await Habit.insertMany(habits);

    console.log("✅ Demo User data seeded successfully!");
    console.log("📊 4 demo habits with 3 months history added.");

    await mongoose.connection.close();

    console.log("🔌 MongoDB connection closed");
  } catch (error) {
    console.error("❌ Seed Error:", error);
    process.exit(1);
  }
};

seedDemoData();