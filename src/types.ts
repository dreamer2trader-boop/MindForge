import { type TaskCategory } from "./components/CategoryBadge";

export interface Task {
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  frequency: "Daily" | "Selected Days" | "One-time";
  selectedDays?: number[];
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  difficulty: number; // 1-5 (affects XP reward)
}

export interface UserProfile {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  totalTasksCompleted: number;
  joinedDate: string;
}

export interface DailyStats {
  date: string;
  tasksCompleted: number;
  totalTasks: number;
  xpEarned: number;
  categories: { [key in TaskCategory]?: number };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}
