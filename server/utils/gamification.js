// --------------------------------------------------
// GAMIFICATION UTILITIES
// --------------------------------------------------

// XP earned for one habit completion
const XP_PER_COMPLETION = 10;

// Calculate XP from total completions
const calculateXP = (completions = 0) => {
  return completions * XP_PER_COMPLETION;
};

// Calculate current level from XP
const calculateLevel = (xp = 0) => {
  return Math.floor(xp / 100) + 1;
};

// Calculate XP progress within current level
const calculateLevelProgress = (xp = 0) => {
  const level = calculateLevel(xp);
  const levelStartXP = (level - 1) * 100;

  return xp - levelStartXP;
};

// Calculate XP remaining for next level
const calculateXPToNextLevel = (xp = 0) => {
  const progress = calculateLevelProgress(xp);

  return 100 - progress;
};

// Calculate streak based on previous completion date
const calculateStreak = (
  lastCompletedDate,
  currentDate,
  currentStreak = 0
) => {
  // First completion
  if (!lastCompletedDate) {
    return 1;
  }

  const lastDate = new Date(
    `${lastCompletedDate}T00:00:00`
  );

  const todayDate = new Date(
    `${currentDate}T00:00:00`
  );

  const difference = Math.round(
    (todayDate - lastDate) /
      (1000 * 60 * 60 * 24)
  );

  // Completed yesterday
  if (difference === 1) {
    return currentStreak + 1;
  }

  // Already completed today
  if (difference === 0) {
    return currentStreak || 1;
  }

  // Missed one or more days
  return 1;
};

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();

  return (
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0")
  );
};
const getAchievements = (
  totalCompletions = 0,
  bestStreak = 0
) => {
  return [
    {
      icon: "🏅",
      name: "First Step",
      description: "Complete your first habit",
      unlocked: totalCompletions >= 1,
    },
    {
      icon: "🔥",
      name: "Streak Starter",
      description: "Reach a 3 day streak",
      unlocked: bestStreak >= 3,
    },
    {
      icon: "⭐",
      name: "Habit Builder",
      description: "Complete 10 habits",
      unlocked: totalCompletions >= 10,
    },
    {
      icon: "🏆",
      name: "Habit Master",
      description: "Reach 100 completions",
      unlocked: totalCompletions >= 100,
    },
  ];
};

module.exports = {
  XP_PER_COMPLETION,
  calculateXP,
  calculateLevel,
  calculateLevelProgress,
  calculateXPToNextLevel,
  calculateStreak,
  getTodayDate,
  getAchievements,
};