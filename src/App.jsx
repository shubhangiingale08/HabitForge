import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


function App() {
  const defaultHabits = [
    {
      name: "Morning Exercise",
      icon: "💪",
      category: "Health",
      completed: false,
      streak: 0,
      completions: 0,
      history: [],
      reminder: "",
      priority: "Medium",
      frequency: "Daily",
    },
    {
      name: "Read for 30 Minutes",
      icon: "📚",
      category: "Study",
      completed: false,
      streak: 0,
      completions: 0,
      history: [],
      reminder: "",
      priority: "Medium",
      frequency: "Daily",
    },
    {
      name: "Drink 8 Glasses of Water",
      icon: "💧",
      category: "Personal",
      completed: false,
      streak: 0,
      completions: 0,
      history: [],
      reminder: "",
      priority: "Medium",
      frequency: "Daily",
    },
    {
      name: "Meditate for 10 Minutes",
      icon: "🧘",
      category: "Wellness",
      completed: false,
      streak: 0,
      completions: 0,
      history: [],
      reminder: "",
      priority: "Medium",
      frequency: "Daily",
    },
    {
      name: "Study for 1 Hour",
      icon: "🎓",
      category: "Study",
      completed: false,
      streak: 0,
      completions: 0,
      history: [],
      reminder: "",
      priority: "Medium",
      frequency: "Daily",
    },
    {
      name: "Drink Enough Water",
      icon: "🥤",
      category: "Health",
      completed: false,
      streak: 0,
      completions: 0,
      history: [],
      reminder: "",
      priority: "Medium",
      frequency: "Daily",
    },
    {
      name: "Practice Coding",
      icon: "💻",
      category: "Study",
      completed: false,
      streak: 0,
      completions: 0,
      history: [],
      reminder: "",
      priority: "Medium",
      frequency: "Daily",
    },
    {
      name: "Go for a Walk",
      icon: "🚶",
      category: "Health",
      completed: false,
      streak: 0,
      completions: 0,
      history: [],
      reminder: "",
      priority: "Medium",
      frequency: "Daily",
    },
    {
      name: "Write in Journal",
      icon: "📝",
      category: "Wellness",
      completed: false,
      streak: 0,
      completions: 0,
      history: [],
      reminder: "",
      priority: "Medium",
      frequency: "Daily",
    },
    {
      name: "Sleep on Time",
      icon: "😴",
      category: "Personal",
      completed: false,
      streak: 0,
      completions: 0,
      history: [],
      reminder: "",
      priority: "Medium",
      frequency: "Daily",
    },
  ];
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
  return localStorage.getItem("habitforge-user") ? true : false;
});
const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("habitforge-user");
  return savedUser ? JSON.parse(savedUser) : null;
});
const [showLogin, setShowLogin] = useState(true);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [name, setName] = useState("");
const handleLogout = () => {
  localStorage.removeItem("habitforge-user");
  localStorage.removeItem("habitforge-token");
  setIsLoggedIn(false);
  setUser(null);
  setEmail("");
  setPassword("");
  setName("");
};
const handleAuth = async (e) => {
  e.preventDefault();

  try {
    const endpoint = showLogin ? "login" : "register";

    const body = showLogin
      ? { email, password }
      : { name, email, password };

    console.log("Sending request:", endpoint, body);

    const response = await fetch(
      `https://habitforge-backend-4s1j.onrender.com/api/auth/${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const text = await response.text();

    console.log("Server response:", response.status, text);

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        `Server returned invalid response: ${text}`
      );
    }

    if (!response.ok) {
      alert(data.message || "Authentication failed");
      return;
    }

    setUser(data.user);
    localStorage.setItem("habitforge-user", JSON.stringify(data.user));
    localStorage.setItem("habitforge-token", data.token);
    setIsLoggedIn(true);

    alert(
      showLogin
        ? "Login successful! 🎉"
        : "Registration successful! 🎉"
    );
  } catch (error) {
    console.error("AUTH ERROR:", error);

    alert(
      "Authentication Error:\n" +
      error.message
    );
  }
};

   const [habits, setHabits] = useState([]);
  const [backendXP, setBackendXP] = useState(0);
const [backendLevel, setBackendLevel] = useState(1);
const [backendAchievements, setBackendAchievements] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [newHabit, setNewHabit] = useState("");
  const [newHabitCategory, setNewHabitCategory] = useState("Personal");
  const [newHabitReminder, setNewHabitReminder] = useState("");
  const [newHabitPriority, setNewHabitPriority] = useState("Medium");
  const [newHabitFrequency, setNewHabitFrequency] = useState("Daily");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const [editingId, setEditingId] = useState(null);
  const [editHabitName, setEditHabitName] = useState("");

  const [showCalendar, setShowCalendar] = useState(false);
  const [isPremium, setIsPremium] = useState(() => {
  return localStorage.getItem("habitforge-premium") === "true";
});
  

  // --------------------------------------------------
  // FETCH HABITS FROM MONGODB
  // --------------------------------------------------

  useEffect(() => {
  const fetchHabits = async () => {
    if (!user?.id) {
      return;
    }

    try {
     const token = localStorage.getItem("habitforge-token");
     
const response = await fetch(
  "https://habitforge-backend-4s1j.onrender.com/api/habits",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
      if (!response.ok) {
        throw new Error("Failed to fetch habits");
      }

      const data = await response.json();

      setHabits(data);

      const totalCompletions = data.reduce(
        (total, habit) =>
          total + (habit.completions || 0),
        0
      );

      const totalXP = totalCompletions * 10;
      const totalLevel =
        Math.floor(totalXP / 100) + 1;

      setBackendXP(totalXP);
      setBackendLevel(totalLevel);
    } catch (error) {
      console.error(
        "❌ Error fetching habits:",
        error
      );
    }
  };

  fetchHabits();
}, [user]);
  // --------------------------------------------------
  // LOCAL STORAGE BACKUP
  // --------------------------------------------------

  

  // --------------------------------------------------
  // REMINDERS
  // --------------------------------------------------

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();

      const currentTime =
        `${String(now.getHours()).padStart(2, "0")}:` +
        `${String(now.getMinutes()).padStart(2, "0")}`;

      habits.forEach((habit) => {
        if (
          habit.reminder === currentTime &&
          !habit.completed
        ) {
          setSuccessMessage(
            `⏰ Reminder: ${habit.name}`
          );

          setTimeout(() => {
            setSuccessMessage("");
          }, 5000);
        }
      });
    };

    checkReminders();

    const reminderInterval = setInterval(
      checkReminders,
      60000
    );

    return () => clearInterval(reminderInterval);
  }, [habits]);

  // --------------------------------------------------
  // QUOTES
  // --------------------------------------------------

  const quotes = [
    "Small steps every day lead to big results. 🌱",
    "Consistency is the key to success. 🔥",
    "You don't have to be perfect, just keep going. 💪",
    "Believe in yourself and keep moving forward. 🚀",
    "Every completed habit is a step toward a better you. ⭐",
  ];

  const dailyQuote =
    quotes[Math.floor(Math.random() * quotes.length)];

  // --------------------------------------------------
  // HELPER
  // --------------------------------------------------

  const getHabitId = (habit) => {
    return habit._id || habit.id;
  };

  // --------------------------------------------------
  // COMPLETE HABIT + STREAK
  // --------------------------------------------------

  const toggleHabit = async (id) => {
  const habit = habits.find(
    (h) => getHabitId(h) === id
  );

  if (!habit) return;
  const token = localStorage.getItem("habitforge-token");

  // Local date (YYYY-MM-DD)
  const today = new Date();
  const todayKey =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  let newCompleted = !habit.completed;
  let newStreak = habit.streak || 0;
  let newCompletions = habit.completions || 0;

  // Convert old history dates to YYYY-MM-DD
  let newHistory = (habit.history || []).map((date) => {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate)) {
      return date;
    }

    return (
      parsedDate.getFullYear() +
      "-" +
      String(parsedDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(parsedDate.getDate()).padStart(2, "0")
    );
  });

  // Remove duplicate dates
  newHistory = [...new Set(newHistory)];

  if (newCompleted) {
    // Complete habit
    newCompletions += 1;

    // Add today's date only once
    if (!newHistory.includes(todayKey)) {
      newHistory.push(todayKey);
    }

    // Calculate streak
    if (habit.lastCompletedDate) {
      const lastDate = new Date(
        habit.lastCompletedDate + "T00:00:00"
      );

      const todayDate = new Date(
        todayKey + "T00:00:00"
      );

      const difference = Math.round(
        (todayDate - lastDate) /
          (1000 * 60 * 60 * 24)
      );

      if (difference === 1) {
        newStreak += 1;
      } else if (difference === 0) {
        // Already completed today
        newStreak = habit.streak || 1;
      } else {
        // Missed one or more days
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }
  } else {
    // Mark incomplete
    newCompletions = Math.max(
      0,
      newCompletions - 1
    );

    // Remove today's completion
    newHistory = newHistory.filter(
      (date) => date !== todayKey
    );

    // Recalculate streak from remaining history
    if (newHistory.length === 0) {
      newStreak = 0;
    } else {
      newStreak = 1;
    }
  }

  // Find latest completed date
  const sortedHistory = [...newHistory].sort();

  const newLastCompletedDate =
    sortedHistory.length > 0
      ? sortedHistory[sortedHistory.length - 1]
      : null;

  // MongoDB habit
  if (habit._id) {
    try {
      const response = await fetch(
        `https://habitforge-backend-4s1j.onrender.com/api/habits/${habit._id}`,
        {
          method: "PUT",
         headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},
          body: JSON.stringify({
            completed: newCompleted,
            streak: newStreak,
            completions: newCompletions,
            history: newHistory,
            lastCompletedDate:
              newLastCompletedDate,
              
          }),
        }
      );
     const data = await response.json();

if (!response.ok) {
  throw new Error(
    "Failed to update habit"
  );
}
// Update total XP immediately
const updatedTotalCompletions =
  totalCompletions +
  (newCompleted ? 1 : -1);

const updatedXP =
  updatedTotalCompletions * 10;

const updatedLevel =
  Math.floor(updatedXP / 100) + 1;

setBackendXP(updatedXP);
setBackendLevel(updatedLevel);
if (data.achievements !== undefined) {
  setBackendAchievements(data.achievements);
}

const updatedHabit = data;
      setHabits((prevHabits) =>
        prevHabits.map((h) =>
          h._id === habit._id
            ? updatedHabit
            : h
        )
      );

      setSuccessMessage(
        newCompleted
          ? "🎉 Great job! Keep going!"
          : "↩️ Habit marked incomplete"
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 2500);

    } catch (error) {
      console.error(
        "❌ Error updating habit:",
        error
      );

      setSuccessMessage(
        "❌ Failed to update habit"
      );
    }

    return;
  }

  // Local fallback
  setHabits((prevHabits) =>
    prevHabits.map((h) =>
      getHabitId(h) === id
        ? {
            ...h,
            completed: newCompleted,
            streak: newStreak,
            completions: newCompletions,
            history: newHistory,
            lastCompletedDate:
              newLastCompletedDate,
          }
        : h
    )
  );

  setSuccessMessage(
    newCompleted
      ? "🎉 Great job! Keep going!"
      : "↩️ Habit marked incomplete"
  );

  setTimeout(() => {
    setSuccessMessage("");
  }, 2500);
};
    

  // --------------------------------------------------
  // ADD HABIT
  // --------------------------------------------------

  const addHabit = async () => {
    if (newHabit.trim() === "") {
      return;
    }

    const habit = {
      name: newHabit.trim(),
      userId: user.id,
      icon: "✨",
      category: newHabitCategory,
      completed: false,
      streak: 0,
      completions: 0,
      history: [],
      reminder: newHabitReminder,
      priority: newHabitPriority,
      frequency: newHabitFrequency,
    };

    try {
      const response = await fetch(
        "https://habitforge-backend-4s1j.onrender.com/api/habits",
        {
          method: "POST",
          headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("habitforge-token")}`,
},
          body: JSON.stringify(habit),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to add habit"
        );
      }

      const savedHabit =
        await response.json();

      setHabits((prevHabits) => [
        ...prevHabits,
        savedHabit,
      ]);

      setNewHabit("");
      setNewHabitReminder("");
      setNewHabitPriority("Medium");
      setNewHabitFrequency("Daily");
      setShowForm(false);

      setSuccessMessage(
        "✅ Habit saved successfully!"
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 2500);

    } catch (error) {
      console.error(
        "❌ Error adding habit:",
        error
      );

      setSuccessMessage(
        "❌ Failed to save habit"
      );
    }
  };

  // --------------------------------------------------
  // DELETE HABIT
  // --------------------------------------------------

  const deleteHabit = async (id) => {
  const habit = habits.find(
    (h) => getHabitId(h) === id
  );

  if (!habit) return;

  if (habit._id) {
    try {
      const token = localStorage.getItem("habitforge-token");

const response = await fetch(
  `https://habitforge-backend-4s1j.onrender.com/api/habits/${habit._id}`,
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      if (!response.ok) {
        throw new Error(
          "Failed to delete habit"
        );
      }

      setHabits((prevHabits) =>
        prevHabits.filter(
          (h) => h._id !== habit._id
        )
      );

      setSuccessMessage(
        "🗑️ Habit deleted successfully!"
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 2500);

    } catch (error) {
      console.error(
        "❌ Error deleting habit:",
        error
      );

      setSuccessMessage(
        "❌ Failed to delete habit"
      );
    }

    return;
  }

  setHabits((prevHabits) =>
    prevHabits.filter(
      (h) => getHabitId(h) !== id
    )
  );
};
  // --------------------------------------------------
  // EDIT HABIT
  // --------------------------------------------------

  const startEdit = (habit) => {
    setEditingId(getHabitId(habit));
    setEditHabitName(habit.name);
  };

  const saveEdit = async (id) => {
  if (editHabitName.trim() === "") {
    return;
  }

  const habit = habits.find(
    (h) => getHabitId(h) === id
  );

  if (!habit) return;

  if (habit._id) {
    try {
      const token = localStorage.getItem("habitforge-token");
      const response = await fetch(
        `https://habitforge-backend-4s1j.onrender.com/api/habits/${habit._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editHabitName.trim(),
            userId: user.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to edit habit"
        );
      }

      const updatedHabit = {
        ...habit,
        ...data,
        name: editHabitName.trim(),
      };

      setHabits((prevHabits) =>
        prevHabits.map((h) =>
          h._id === habit._id
            ? updatedHabit
            : h
        )
      );

      setEditingId(null);
      setEditHabitName("");

      setSuccessMessage(
        "✏️ Habit updated successfully!"
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 2500);

    } catch (error) {
      console.error(
        "❌ Error editing habit:",
        error
      );

      setSuccessMessage(
        "❌ Failed to edit habit"
      );
    }

    return;
  }

  // Local fallback
  setHabits((prevHabits) =>
    prevHabits.map((h) =>
      getHabitId(h) === id
        ? {
            ...h,
            name: editHabitName.trim(),
          }
        : h
    )
  );

  setEditingId(null);
  setEditHabitName("");

  setSuccessMessage(
    "✏️ Habit updated successfully!"
  );

  setTimeout(() => {
    setSuccessMessage("");
  }, 2500);
};
  // --------------------------------------------------
  // RESET TODAY
  // --------------------------------------------------

  const resetToday = async () => {
  try {
    const updatedHabits = [];

    for (const habit of habits) {
      if (habit._id && habit.completed) {
        const response = await fetch(
          `https://habitforge-backend-4s1j.onrender.com/api/habits/${habit._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              completed: false,
              userId: user.id,
            }),
          }
        );

        if (response.ok) {
          const updated = await response.json();
          updatedHabits.push(updated);
        } else {
          updatedHabits.push(habit);
        }
      } else {
        updatedHabits.push({
          ...habit,
          completed: false,
        });
      }
    }

    setHabits(updatedHabits);

    setSuccessMessage(
      "🔄 Today's habits have been reset!"
    );

    setTimeout(() => {
      setSuccessMessage("");
    }, 2500);

  } catch (error) {
    console.error(
      "❌ Reset error:",
      error
    );

    setSuccessMessage(
      "❌ Failed to reset today's habits"
    );
  }
};
  // --------------------------------------------------
// YEARLY COMPLETION HEATMAP
// --------------------------------------------------

const getHeatmapData = () => {
  const data = {};

  habits.forEach((habit) => {
    if (habit.history && Array.isArray(habit.history)) {
      habit.history.forEach((date) => {
        data[date] = (data[date] || 0) + 1;
      });
    }
  });

  return data;
};

const heatmapData = getHeatmapData();

  // --------------------------------------------------
  // EXPORT DATA
  // --------------------------------------------------
const exportCSV = () => {
  if (!isPremium) {
    setSuccessMessage(
      "👑 CSV Export is a Premium feature!"
    );

    setTimeout(() => {
      setSuccessMessage("");
    }, 2500);

    return;
  }

  const headers = [
    "Name",
    "Category",
    "Priority",
    "Frequency",
    "Streak",
    "Completions",
    "Completed",
    "Last Completed Date",
  ];

  const rows = habits.map((habit) => [
    habit.name,
    habit.category,
    habit.priority,
    habit.frequency || "Daily",
    habit.streak || 0,
    habit.completions || 0,
    habit.completed ? "Yes" : "No",
    habit.lastCompletedDate || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((value) =>
          `"${String(value).replace(/"/g, '""')}"`
        )
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "habitforge-data.csv";

  link.click();

  URL.revokeObjectURL(url);

  setSuccessMessage(
    "📊 Habit data exported as CSV successfully!"
  );

  setTimeout(() => {
    setSuccessMessage("");
  }, 2500);
};
const getLast30DaysData = () => {
  const data = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const dateKey = date.toISOString().split("T")[0];

    let completedCount = 0;

    habits.forEach((habit) => {
      if (habit.history?.includes(dateKey)) {
        completedCount++;
      }
    });

    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      completed: completedCount,
    });
  }

  return data;
};
  

  // --------------------------------------------------
  // PROGRESS
  // --------------------------------------------------

  const getProgress = (habit) => {
    if (!habit.completions) {
      return 0;
    }

    return Math.min(
      habit.completions * 10,
      100
    );
  };

  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filteredHabits = habits.filter(
    (habit) => {
      const matchesCategory =
        selectedCategory === "All" ||
        habit.category ===
          selectedCategory;

      const matchesSearch =
        habit.name
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      return (
        matchesCategory &&
        matchesSearch
      );
    }
  );

  // --------------------------------------------------
  // SORT
  // --------------------------------------------------

  const sortedHabits = [
    ...filteredHabits,
  ].sort((a, b) => {
    if (sortOption === "name") {
      return a.name.localeCompare(
        b.name
      );
    }

    if (
      sortOption === "completions"
    ) {
      return (
        b.completions -
        a.completions
      );
    }

    if (sortOption === "streak") {
      return b.streak - a.streak;
    }

    if (sortOption === "priority") {
      const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
      };

      return (
        priorityOrder[a.priority] -
        priorityOrder[b.priority]
      );
    }

    return 0;
  });

  // --------------------------------------------------
  // STATS
  // --------------------------------------------------

  const completedCount =
    habits.filter(
      (habit) => habit.completed
    ).length;

  const totalCompletions =
    habits.reduce(
      (total, habit) =>
        total +
        (habit.completions || 0),
      0
    );

 const currentXP = backendXP;
const currentLevel = backendLevel;

  const levelStartXP =
    (currentLevel - 1) * 100;

  const levelProgress =
    currentXP - levelStartXP;

  const progressPercent =
    levelProgress;

  const xpToNextLevel =
    100 - levelProgress;

  const dayStreak = Math.max(
    0,
    ...habits.map(
      (habit) => habit.streak || 0
    )
  );

  const bestStreak = Math.max(
    0,
    ...habits.map(
      (habit) => habit.streak || 0
    )
  );

  const progressPercentOverall =
    habits.length === 0
      ? 0
      : Math.round(
          (completedCount /
            habits.length) *
            100
        );
        

  // --------------------------------------------------
  // ACHIEVEMENTS
  // --------------------------------------------------

  const achievements = [
    {
      icon: "🏅",
      name: "First Step",
      description:
        "Complete your first habit",
      unlocked:
        totalCompletions >= 1,
      progress: Math.min(
        totalCompletions,
        1
      ),
      target: 1,
    },
    {
      icon: "🔥",
      name: "Streak Starter",
      description:
        "Reach a 3 day streak",
      unlocked: dayStreak >= 3,
      progress: Math.min(
        dayStreak,
        3
      ),
      target: 3,
    },
    {
      icon: "⭐",
      name: "Habit Builder",
      description:
        "Complete 10 habits",
      unlocked:
        totalCompletions >= 10,
      progress: Math.min(
        totalCompletions,
        10
      ),
      target: 10,
    },
    {
      icon: "🏆",
      name: "Habit Master",
      description:
        "Reach 100 completions",
      unlocked:
        totalCompletions >= 100,
      progress: Math.min(
        totalCompletions,
        100
      ),
      target: 100,
    },
  ];

  // --------------------------------------------------
  // DATE
  // --------------------------------------------------

  const getDateKey = (date) => {
    const d = new Date(date);

    return `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  // --------------------------------------------------
  // WEEKLY PROGRESS
  // --------------------------------------------------

  const weeklyProgress = Array.from(
    { length: 7 },
    (_, index) => {
      const today = new Date();

      const monday = new Date(
        today
      );

      const day = today.getDay();

      monday.setDate(
        today.getDate() -
          ((day + 6) % 7)
      );

      const currentDay =
        new Date(monday);

      currentDay.setDate(
        monday.getDate() + index
      );

      const currentDateKey =
        getDateKey(currentDay);

      const completed =
        habits.reduce(
          (total, habit) => {
            const count = (
              habit.history || []
            ).filter(
              (date) =>
                getDateKey(date) ===
                currentDateKey
            ).length;

            return total + count;
          },
          0
        );

      return {
        day: currentDay.toLocaleDateString(
          "en-US",
          {
            weekday: "short",
          }
        ),
        completed,
      };
    }
  );
  
{/* MONTHLY ANALYTICS */}
  
  // --------------------------------------------------
  // MONTHLY ANALYTICS
  // --------------------------------------------------

  const currentMonth =
    new Date().getMonth();

  const currentYear =
    new Date().getFullYear();

  const monthlyCompletions =
    habits.reduce(
      (total, habit) => {
        const count = (
          habit.history || []
        ).filter((date) => {
          const d = new Date(date);

          return (
            d.getMonth() ===
              currentMonth &&
            d.getFullYear() ===
              currentYear
          );
        }).length;

        return total + count;
      },
      0
    );

  const bestHabit =
    habits.reduce(
      (best, habit) =>
        habit.completions >
        (best?.completions || 0)
          ? habit
          : best,
      null
    );
    // 🔐 LOGIN / REGISTER
if (!isLoggedIn) {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>🔥 HabitForge</h1>

        <h2>
          {showLogin ? "Login" : "Create Account"}
        </h2>

        <form onSubmit={handleAuth}>
          {!showLogin && (
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />
          )}

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button type="submit">
            {showLogin ? "Login" : "Register"}
          </button>
        </form>

        <p>
          {showLogin
            ? "Don't have an account?"
            : "Already have an account?"}
        </p>

        <button
          type="button"
          onClick={() =>
            setShowLogin(!showLogin)
          }
        >
          {showLogin
            ? "Create Account"
            : "Login"}
        </button>
      </div>
    </div>
  );
}

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div
      className={`app ${
        darkMode
          ? "dark-mode"
          : ""
      }`}
    >
      {/* NAVBAR */}

      <header className="navbar">
        <div className="logo">
          <span>🔥</span> HabitForge
        </div>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">
            Contact
          </a>
        </nav>

        <div className="nav-right">
          <button
            className="theme-btn"
            onClick={() =>
              setDarkMode(
                !darkMode
              )
            }
          >
            {darkMode
              ? "☀️"
              : "🌙"}
          </button>
          <button
  className="premium-btn"
  onClick={() => {
    setIsPremium(true);
    localStorage.setItem("habitforge-premium", "true");
  }}
>
  ⭐ Unlock Premium
</button>
          <span className="level">
            Level {currentLevel}
          </span>

          <div className="avatar">
            S
          </div>
           

         <button
  className="logout-btn"
  onClick={handleLogout}
>
  Logout
</button>
        </div>
      </header>

      <main
       
        className="dashboard"
        id="home"
      >
        {/* SUCCESS MESSAGE */}

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {/* QUOTE */}

        <section className="quote-card">
          <span>💡</span>
          <p>{dailyQuote}</p>
        </section>

        {/* WELCOME */}

        <section className="welcome">
          <div>
            <p className="date">
              TODAY'S JOURNEY
            </p>

            <h1>
              Good Morning! 👋
            </h1>

            <p>
              Small habits create big
              changes. Keep going!
            </p>
          </div>

          <div className="xp-card">
            <span>⭐</span>

            <div>
              <p>Current XP</p>

              <h2>
                {currentXP} XP
              </h2>

              <div className="xp-progress">
                <div
                  className="xp-progress-bar"
                  style={{
                    width: `${progressPercent}%`,
                  }}
                ></div>
              </div>

              <small>
                {levelProgress}/100 XP
                to next level
              </small>

              <p className="next-level">
                {xpToNextLevel} XP to
                Level{" "}
                {currentLevel + 1}
              </p>
            </div>
          </div>
        </section>

        {/* STATS */}

        <section className="stats">
          <div className="stat-card">
            <span>🔥</span>

            <div>
              <h3>
                {dayStreak}
              </h3>

              <p>Day Streak</p>
            </div>
          </div>

          <div className="stat-card">
            <span>✅</span>

            <div>
              <h3>
                {completedCount}/
                {habits.length}
              </h3>

              <p>
                Habits Completed
              </p>
            </div>
          </div>

          <div className="stat-card">
            <span>🏆</span>

            <div>
              <h3>
                {currentLevel}
              </h3>

              <p>
                Current Level
              </p>
            </div>
          </div>
        </section>

        {/* PROGRESS STATS */}

        <section className="progress-stats">
          <div className="progress-card">
            <h3>
              {progressPercentOverall}%
            </h3>

            <p>
              Overall Progress
            </p>
          </div>

          <div className="progress-card">
            <h3>
              {totalCompletions}
            </h3>

            <p>
              Total Completions
            </p>
          </div>

          <div className="progress-card">
            <h3>
              {bestStreak}
            </h3>

            <p>
              Best Streak 🔥
            </p>
          </div>
        </section>

        {/* WEEKLY PROGRESS */}

        <section className="weekly-progress-section">
          <div className="section-header">
            <div>
              <h2>
                Weekly Progress 📊
              </h2>

              <p>
                Track your completed
                habits this week!
              </p>
            </div>
          </div>

          <div className="weekly-progress">
            {weeklyProgress.map(
              (item) => (
                <div
                  className="weekly-day"
                  key={item.day}
                >
                  <div className="weekly-bar">
                    <div
                      className="weekly-bar-fill"
                      style={{
                        height: `${Math.min(
                          item.completed *
                            20,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>

                  <strong>
                    {item.completed}
                  </strong>

                  <span>
                    {item.day}
                  </span>
                </div>
              )
            )}
          </div>
        </section>

        {/* SEARCH */}

        <div className="search-box">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search habits..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />

          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() =>
                setSearchTerm("")
              }
            >
              ✕
            </button>
          )}
        </div>

        {/* SORT */}

        <div className="sort-box">
          <label>
            Sort by:
          </label>

          <select
            value={sortOption}
            onChange={(e) =>
              setSortOption(
                e.target.value
              )
            }
          >
            <option value="default">
              Default
            </option>

            <option value="name">
              Name A-Z
            </option>

            <option value="completions">
              Most Completed
            </option>

            <option value="streak">
              Highest Streak
            </option>

            <option value="priority">
              Priority
            </option>
          </select>
        </div>

        {/* CATEGORY */}

        <div className="category-filter">
          {[
            "All",
            "Health",
            "Study",
            "Personal",
            "Wellness",
          ].map(
            (category) => (
              <button
                key={category}
                className={
                  selectedCategory ===
                  category
                    ? "category-btn active"
                    : "category-btn"
                }
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
              >
                {category}
              </button>
            )
          )}
        </div>

        {/* HABITS */}

        <section className="habits-section">
          <div className="section-header">
            <div>
              <h2>
                Today's Habits
              </h2>

              <p>
                Complete your habits
                and earn XP!
              </p>
            </div>

            <button
              className="add-btn"
              onClick={() =>
                setShowForm(
                  !showForm
                )
              }
            >
              + Add Habit
            </button>
          </div>

          {/* ADD FORM */}

          {showForm && (
            <div className="add-habit-form">
              <input
                type="text"
                placeholder="Enter your new habit..."
                value={newHabit}
                onChange={(e) =>
                  setNewHabit(
                    e.target.value
                  )
                }
              />

              <input
                type="time"
                value={
                  newHabitReminder
                }
                onChange={(e) =>
                  setNewHabitReminder(
                    e.target.value
                  )
                }
              />

              <select
                value={
                  newHabitPriority
                }
                onChange={(e) =>
                  setNewHabitPriority(
                    e.target.value
                  )
                }
              >
                <option value="High">
                  🔴 High
                </option>

                <option value="Medium">
                  🟡 Medium
                </option>

                <option value="Low">
                  🟢 Low
                </option>
              </select>

              <select
                value={
                  newHabitCategory
                }
                onChange={(e) =>
                  setNewHabitCategory(
                    e.target.value
                  )
                }
              >
                <option value="Health">
                  Health
                </option>

                <option value="Study">
                  Study
                </option>

                <option value="Personal">
                  Personal
                </option>

                <option value="Wellness">
                  Wellness
                </option>
              </select>
              <div className="form-group">
  <label>Frequency</label>

  <select
    value={newHabitFrequency}
    onChange={(e) => setNewHabitFrequency(e.target.value)}
  >
    <option value="Daily">Daily</option>
    <option value="Weekly">Weekly</option>
  </select>
</div>

              <button
                onClick={addHabit}
              >
                Add
              </button>

              <button
                className="reset-btn"
                onClick={
                  resetToday
                }
              >
                🔄 Reset Today
              </button>
            </div>
          )}

          {/* HABIT LIST */}

          <div className="habit-list">
            {filteredHabits.length ===
              0 && (
              <div className="no-habits">
                <span>🔍</span>

                <h3>
                  No habits found
                </h3>

                <p>
                  Try a different
                  search or category.
                </p>
              </div>
            )}

            {sortedHabits.map(
              (habit) => {
                const habitId =
                  getHabitId(
                    habit
                  );

                return (
                 
                  <motion.div
  className="habit-card"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  
  


                    <div className="habit-info">
                      <div className="habit-icon">
                        {habit.icon}
                        </div>
                      
                      {/* EDIT */}

                      {editingId ===
                      habitId ? (
                        <input
                          type="text"
                          value={
                            editHabitName
                          }
                          onChange={(e) =>
                            setEditHabitName(
                              e.target
                                .value
                            )
                          }
                          className="edit-input"
                        />
                      ) : (
                        <h3>
                          {habit.name}
                        </h3>
                      )}

                      <span className="habit-category">
                        {habit.category}
                      </span>
                      <span className="habit-frequency">
  🔄 {habit.frequency || "Daily"}
</span>

                      <span className="habit-priority">
                        {habit.priority ===
                          "High" &&
                          "🔴 High"}

                        {habit.priority ===
                          "Medium" &&
                          "🟡 Medium"}

                        {habit.priority ===
                          "Low" &&
                          "🟢 Low"}
                      </span>

                      <div className="habit-progress">
                        <span>
                          🔥{" "}
                          {habit.streak ||
                            0}{" "}
                          streak
                        </span>

                        <span>
                          ✅{" "}
                          {habit.completions ||
                            0}{" "}
                          completions
                        </span>
                      </div>

                      {habit.history &&
                        habit.history
                          .length >
                          0 && (
                          <div className="habit-history">
                            📅 Last completed:{" "}
                            {
                              habit
                                .history[
                                habit
                                  .history
                                  .length -
                                  1
                              ]
                            }
                          </div>
                        )}

                      {habit.history &&
                        habit.history
                          .length >
                          0 && (
                          <div className="completed-dates">
                            <strong>
                              📅 Completed
                              Dates:
                            </strong>

                            <div className="date-list">
                              {habit.history.map(
                                (
                                  date,
                                  index
                                ) => (
                                  <span
                                    key={
                                      index
                                    }
                                  >
                                    {date}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {habit.reminder && (
                        <div className="habit-reminder">
                          ⏰ Reminder:{" "}
                          {
                            habit.reminder
                          }
                        </div>
                      )}

                      <div className="progress-percent">
                        📊{" "}
                        {getProgress(
                          habit
                        )}
                        %
                      </div>

                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${getProgress(
                              habit
                            )}%`,
                          }}
                        ></div>
                      </div>

                      <div className="habit-progress-bar-container">
                        <div
                          className="habit-progress-bar-fill"
                          style={{
                            width: `${Math.min(
                              (habit.completions ||
                                0) *
                                10,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>

                      <small className="habit-progress-text">
                        {Math.min(
                          (habit.completions ||
                            0) * 10,
                          100
                        )}
                        % Progress
                      </small>
                    </div>

                    {/* ACTIONS */}

                    <div className="habit-actions">
                      <button
                        className="complete-btn"
                        onClick={() =>
                          toggleHabit(
                            habitId
                          )
                        }
                      >
                        {habit.completed
                          ? "✓ Completed"
                          : "Complete"}
                      </button>

                      {editingId ===
                      habitId ? (
                        <button
                          className="save-btn"
                          onClick={() =>
                            saveEdit(
                              habitId
                            )
                          }
                        >
                          💾 Save
                        </button>
                      ) : (
                        <button
                          className="edit-btn"
                          onClick={() =>
                            startEdit(
                              habit
                            )
                          }
                        >
                          ✏️
                        </button>
                      )}

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteHabit(
                            habitId
                          )
                        }
                      >
                        🗑️
                      </button>
                    </div>
                    </motion.div>
                );
              }
            )}
      </div>
        </section>

        {/* HISTORY */}

        <section className="calendar-section">
          <div className="section-header">
            <div>
              <h2>
                Habit History 📅
              </h2>

              <p>
                See all your completed
                habit dates.
              </p>
            </div>

            <button
              className="calendar-btn"
              onClick={() =>
                setShowCalendar(
                  !showCalendar
                )
              }
            >
              {showCalendar
                ? "Hide History"
                : "View History"}
            </button>
          </div>

          {showCalendar && (
            <div className="history-overview">
              {habits.map(
                (habit) => (
                  <div
                    className="history-item"
                    key={getHabitId(
                      habit
                    )}
                  >
                    <div>
                      <span>
                        {habit.icon}
                      </span>

                      <strong>
                        {habit.name}
                      </strong>
                    </div>

                    {habit.history &&
                    habit.history
                      .length > 0 ? (
                      <div className="history-dates">
                        {habit.history.map(
                          (
                            date,
                            index
                          ) => (
                            <span
                              key={
                                index
                              }
                            >
                              {date}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      <p>
                        No completed
                        dates yet.
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </section>
        {/* YEARLY COMPLETION HEATMAP */}

<section className="heatmap-section">
  <div className="section-header">
    <div>
      <h2>📅 Yearly Completion Heatmap</h2>

      <p>
        Your habit completion activity throughout the year.
      </p>
    </div>
  </div>

  <div className="heatmap-grid">
    {Array.from({ length: 365 }, (_, index) => {
      const date = new Date();

      date.setDate(
        date.getDate() - (364 - index)
      );

      const dateString =
        date.toISOString().split("T")[0];

      const count =
        heatmapData[dateString] || 0;
        
  
      return (
        <div
          key={dateString}
          className={`heatmap-day ${
            count === 0
              ? "level-0"
              : count === 1
              ? "level-1"
              : count === 2
              ? "level-2"
              : "level-3"
          }`}
          title={`${dateString}: ${count} completions`}
        ></div>
      );
    })}
  </div>

  <div className="heatmap-legend">
    <span>Less</span>
    <span className="legend-box level-0"></span>
    <span className="legend-box level-1"></span>
    <span className="legend-box level-2"></span>
    <span className="legend-box level-3"></span>
    <span>More</span>
  </div>
</section>

        {/* MONTHLY ANALYTICS */}

        
            <section className="monthly-analytics">
  <div className="section-header">
    <div>
      <h2>
        Monthly Analytics 📊
      </h2>

      <p>
        See your progress for
        this month.
      </p>
    </div>
  </div>

  {isPremium ? (
    <div className="analytics-grid">

      <div className="analytics-card">
        <span>✅</span>

        <h3>
          {monthlyCompletions}
        </h3>

        <p>
          Monthly Completions
        </p>
      </div>

      <div className="analytics-card">
        <span>🔥</span>

        <h3>
          {bestHabit
            ? bestHabit.streak
            : 0}
        </h3>

        <p>
          Best Current Streak
        </p>
      </div>

      <div className="analytics-card">
        <span>⭐</span>

        <h3>
          {bestHabit
            ? bestHabit.name
            : "No habit yet"}
        </h3>

        <p>
          Top Habit
        </p>
      </div>

    </div>
  ) : (
    <div className="premium-lock">
      <h3>👑 Premium Analytics</h3>

      <p>
        Upgrade to Premium to unlock
        Monthly Analytics.
      </p>

      <button
        className="premium-btn"
        onClick={() => {
          setIsPremium(true);
          localStorage.setItem(
            "habitforge-premium",
            "true"
          );
        }}
      >
        ⭐ Unlock Premium
      </button>
    </div>
  )}
</section>

        {/* PROGRESS CHART */}

        <section className="progress-chart-section">
          <div className="section-header">
            <div>
              <h2>
                Progress Chart 📊
              </h2>

              <p>
                Your weekly habit
                completion overview.
              </p>
            </div>
          </div>

          {isPremium ? (
  <div className="chart-section">
    <h2>📈 30-Day Progress</h2>

    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={getLast30DaysData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="completed"
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
) : (
  <div className="premium-lock">
    <h3>👑 Premium Feature</h3>

    <p>
      Upgrade to Premium to unlock
      30-Day Progress Analytics.
    </p>

    <button
      className="premium-btn"
     onClick={() => {
  setIsPremium(true);
  localStorage.setItem(
    "habitforge-premium",
    "true"
  );
}}
    >
      ⭐ Unlock Premium
    </button>
  </div>
)}

                  
        </section>

        {/* EXPORT */}

       <div className="export-section">
  {isPremium ? (
    <button
      className="export-btn"
      onClick={exportCSV}
    >
      📥 Export Habit Data (CSV)
    </button>
  ) : (
    <div className="premium-lock">
      <h3>👑 Premium Export</h3>
      <p>Upgrade to Premium to unlock CSV data export.</p>

      <button
        className="premium-btn"
        onClick={() => {
          setIsPremium(true);
          localStorage.setItem("habitforge-premium", "true");
        }}
      >
        ⭐ Unlock Premium
      </button>
    </div>
  )}
</div>
{/* USER PROFILE */}

<section className="profile-section">
  <div className="profile-card">

    <div className="profile-avatar">
      👩‍💻
    </div>

    <div className="profile-info">
      <h2>Shubhangi Ingale</h2>
      <p>HabitForge User</p>

      <div className="profile-level">
        <span>⭐ Level {currentLevel}</span>
        <span>⚡ {currentXP} XP</span>
      </div>
    </div>

  </div>

  <div className="badge-collection">
    <h3>🏆 Badge Collection</h3>

    <div className="badges">
      {achievements.map((achievement) => (
        <div
          className="badge-card"
          key={achievement.name}
        >
          <div className="badge-icon">
            {achievement.icon}
          </div>

          <strong>{achievement.name}</strong>

          <p>{achievement.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
        {/* ACHIEVEMENTS */}

        <section className="achievements-section">
          <div className="section-header">
            <div>
              <h2>
                Achievements 🏆
              </h2>

              <p>
                Keep going and unlock
                new badges!
              </p>
            </div>
          </div>

          <div className="achievement-list">
            {achievements.map(
              (achievement) => (
                <div
                  className={`achievement-card ${
                    achievement.unlocked
                      ? "unlocked"
                      : "locked"
                  }`}
                  key={
                    achievement.name
                  }
                >
                  <div className="achievement-icon">
                    {achievement.unlocked
                      ? achievement.icon
                      : "🔒"}
                  </div>

                  <div>
                    <h3>
                      {
                        achievement.name
                      }
                    </h3>

                    <p>
                      {
                        achievement.description
                      }
                    </p>

                    <div className="achievement-progress-text">
                      {
                        achievement.progress
                      }
                      /
                      {
                        achievement.target
                      }
                    </div>

                    <div className="achievement-progress-bar">
                      <div
                        className="achievement-progress-fill"
                        style={{
                          width: `${
                            (achievement.progress /
                              achievement.target) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* ABOUT */}

        <section
          className="info-section"
          id="about"
        >
          <div className="info-card">
            <span className="info-icon">
              🔥
            </span>

            <div>
              <h2>
                About HabitForge
              </h2>

              <p>
                HabitForge is a
                gamified habit tracking
                application designed to
                help users build positive
                habits and stay
                consistent every day.
              </p>

              <p>
                Track your habits, earn
                XP, maintain streaks,
                unlock achievements and
                monitor your progress.
              </p>
            </div>
          </div>
        </section>

        {/* CONTACT */}

        <section
          className="info-section"
          id="contact"
        >
          <div className="info-card">
            <span className="info-icon">
              📩
            </span>

            <div>
              <h2>
                Contact HabitForge 📩
              </h2>

              <p>
                Have a question or
                feedback about
                HabitForge?
              </p>

              <p>
                📧 For feedback,
                suggestions and
                project-related queries,
                please get in touch with
                the HabitForge team.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}

      <footer className="footer">
        <h2>🔥 HabitForge</h2>

        <p>
          © 2026 HabitForge. All Rights
          Reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;