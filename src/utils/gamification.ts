import { UserProfile } from "../types";

// XP needed for each level (exponential growth)
export function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Calculate level from total XP
export function calculateLevel(totalXP: number): number {
  let level = 1;
  let xpNeeded = 0;
  
  while (totalXP >= xpNeeded + getXPForLevel(level)) {
    xpNeeded += getXPForLevel(level);
    level++;
  }
  
  return level;
}

// Get current XP progress in current level
export function getCurrentLevelProgress(totalXP: number): { currentXP: number; xpNeeded: number } {
  const level = calculateLevel(totalXP);
  let xpUsed = 0;
  
  for (let i = 1; i < level; i++) {
    xpUsed += getXPForLevel(i);
  }
  
  return {
    currentXP: totalXP - xpUsed,
    xpNeeded: getXPForLevel(level),
  };
}

// Get level title based on level
export function getLevelTitle(level: number): string {
  if (level >= 50) return "Legendary Master";
  if (level >= 40) return "Discipline Grandmaster";
  if (level >= 30) return "Mental Titan";
  if (level >= 25) return "Elite Warrior";
  if (level >= 20) return "Master of Will";
  if (level >= 15) return "Advanced Practitioner";
  if (level >= 10) return "Dedicated Achiever";
  if (level >= 5) return "Rising Star";
  return "Beginner";
}

// Calculate streak bonus XP
export function getStreakBonus(streak: number): number {
  if (streak >= 30) return 50;
  if (streak >= 14) return 30;
  if (streak >= 7) return 15;
  if (streak >= 3) return 5;
  return 0;
}

// Get mental strength score (0-100)
export function getMentalStrengthScore(profile: UserProfile): number {
  const levelScore = Math.min(profile.level * 2, 40);
  const streakScore = Math.min(profile.currentStreak * 1.5, 30);
  const completionScore = Math.min(profile.totalTasksCompleted / 10, 30);
  
  return Math.min(Math.floor(levelScore + streakScore + completionScore), 100);
}

// Get color for mental strength
export function getMentalStrengthColor(score: number): string {
  if (score >= 80) return "from-cyan-400 via-blue-500 to-purple-600";
  if (score >= 60) return "from-blue-400 via-purple-500 to-pink-500";
  if (score >= 40) return "from-purple-400 via-pink-500 to-rose-500";
  if (score >= 20) return "from-pink-400 to-rose-500";
  return "from-gray-400 to-gray-600";
}
