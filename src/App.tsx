import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Sparkles, Filter } from "lucide-react";
import { toast, Toaster } from "sonner@2.0.3";
import { Task, UserProfile, DailyStats, Achievement } from "./types";
import { TaskCard } from "./components/TaskCard";
import { AddTaskModal } from "./components/AddTaskModal";
import { FloatingAddButton } from "./components/FloatingAddButton";
import { LevelDisplay } from "./components/LevelDisplay";
import { StatsPanel } from "./components/StatsPanel";
import { ProfileView } from "./components/ProfileView";
import { BottomNav } from "./components/BottomNav";
import { FilterPanel, type FilterOptions } from "./components/FilterPanel";
import { PWAInstall } from "./components/PWAInstall";
import { PWAHead } from "./components/PWAHead";
import { PWAStatus } from "./components/PWAStatus";
import { type TaskCategory } from "./components/CategoryBadge";
import {
  calculateLevel,
  getCurrentLevelProgress,
  getXPForLevel,
  getStreakBonus,
} from "./utils/gamification";

type TabType = "all" | "pending" | "completed";
type ViewType = "tasks" | "stats" | "profile";

interface TabButtonProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, count, isActive, onClick }: TabButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex-1 px-4 py-3 rounded-2xl transition-all relative ${
        isActive
          ? "text-white"
          : "text-gray-400 hover:text-gray-300"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-purple-600/30 rounded-2xl neon-border-cyan"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {label}
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          isActive
            ? "bg-cyan-400/20 text-cyan-300"
            : "bg-gray-600/30 text-gray-500"
        }`}>
          {count}
        </span>
      </span>
    </motion.button>
  );
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [activeView, setActiveView] = useState<ViewType>("tasks");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    frequencies: [],
  });
  const [userProfile, setUserProfile] = useState<UserProfile>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalTasksCompleted: 0,
    joinedDate: new Date().toISOString(),
  });
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first-task",
      title: "First Steps",
      description: "Complete your first task",
      icon: "🎯",
      unlocked: false,
    },
    {
      id: "streak-3",
      title: "Getting Started",
      description: "Maintain a 3-day streak",
      icon: "🔥",
      unlocked: false,
    },
    {
      id: "streak-7",
      title: "One Week Warrior",
      description: "Maintain a 7-day streak",
      icon: "⚡",
      unlocked: false,
    },
    {
      id: "streak-30",
      title: "Monthly Master",
      description: "Maintain a 30-day streak",
      icon: "💪",
      unlocked: false,
    },
    {
      id: "level-5",
      title: "Rising Star",
      description: "Reach level 5",
      icon: "⭐",
      unlocked: false,
    },
    {
      id: "level-10",
      title: "Dedicated Achiever",
      description: "Reach level 10",
      icon: "🌟",
      unlocked: false,
    },
    {
      id: "tasks-50",
      title: "Task Crusher",
      description: "Complete 50 tasks",
      icon: "💥",
      unlocked: false,
    },
    {
      id: "tasks-100",
      title: "Century Club",
      description: "Complete 100 tasks",
      icon: "🏆",
      unlocked: false,
    },
  ]);

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("neon-tasks");
    const savedProfile = localStorage.getItem("neon-profile");
    const savedStats = localStorage.getItem("neon-stats");
    const savedAchievements = localStorage.getItem("neon-achievements");

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
    if (savedStats) setDailyStats(JSON.parse(savedStats));
    if (savedAchievements) setAchievements(JSON.parse(savedAchievements));

    // Handle URL parameters for PWA shortcuts
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("action") === "add") {
      setIsModalOpen(true);
    }
    if (urlParams.get("view") === "stats") {
      setActiveView("stats");
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("neon-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("neon-profile", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("neon-stats", JSON.stringify(dailyStats));
  }, [dailyStats]);

  useEffect(() => {
    localStorage.setItem("neon-achievements", JSON.stringify(achievements));
  }, [achievements]);

  // Update current time and check for daily reset
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
      checkDailyReset();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Check if we need to reset daily tasks
  const checkDailyReset = () => {
    const lastResetDate = localStorage.getItem("last-reset-date");
    const todayIST = getISTDateString();

    if (lastResetDate !== todayIST) {
      resetDailyTasks();
      localStorage.setItem("last-reset-date", todayIST);
    }
  };

  // Get IST date string (YYYY-MM-DD)
  const getISTDateString = () => {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istDate = new Date(Date.now() + istOffset);
    return istDate.toISOString().split("T")[0];
  };

  // Get IST time string
  const getISTTimeString = () => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return new Date().toLocaleTimeString("en-IN", options);
  };

  // Reset daily tasks
  const resetDailyTasks = () => {
    const todayIST = getISTDateString();
    const visibleTasks = tasks.filter((task) => shouldShowTask(task));
    const completedToday = visibleTasks.filter((task) => task.completed).length;

    // Check for streak
    if (completedToday === visibleTasks.length && visibleTasks.length > 0) {
      // User completed all tasks, increase streak
      setUserProfile((prev) => ({
        ...prev,
        currentStreak: prev.currentStreak + 1,
        longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1),
      }));
    } else if (visibleTasks.length > 0) {
      // User didn't complete all tasks, reset streak
      setUserProfile((prev) => ({
        ...prev,
        currentStreak: 0,
      }));
    }

    // Save today's stats
    const todayStats: DailyStats = {
      date: todayIST,
      tasksCompleted: completedToday,
      totalTasks: visibleTasks.length,
      xpEarned: visibleTasks
        .filter((t) => t.completed)
        .reduce((sum, t) => sum + t.difficulty * 10, 0),
      categories: {},
    };

    visibleTasks.forEach((task) => {
      if (task.completed) {
        todayStats.categories[task.category] =
          (todayStats.categories[task.category] || 0) + 1;
      }
    });

    setDailyStats((prev) => [...prev, todayStats]);

    // Reset tasks
    setTasks((prevTasks) =>
      prevTasks
        .map((task) => {
          if (task.frequency === "One-time" && task.completed) {
            return null;
          }
          return { ...task, completed: false, completedAt: undefined };
        })
        .filter((task): task is Task => task !== null)
    );
  };

  // Format date for header
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-IN", options);
  };

  // Add or update task
  const handleAddTask = (newTask: {
    name: string;
    description: string;
    category: TaskCategory;
    frequency: "Daily" | "Selected Days" | "One-time";
    selectedDays?: number[];
    difficulty: number;
  }) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...newTask }
            : task
        )
      );
      setEditingTask(null);
      toast.success("Task updated successfully!");
    } else {
      const task: Task = {
        id: Date.now().toString(),
        ...newTask,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [...prev, task]);
      toast.success("Task added successfully!");
    }
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast.success("Task deleted!");
  };

  // Edit task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Complete task
  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const xpEarned = task.difficulty * 10;
    const streakBonus = getStreakBonus(userProfile.currentStreak);
    const totalXP = Math.floor(xpEarned * (1 + streakBonus / 100));

    // Update task
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: true,
              completedAt: getISTTimeString(),
            }
          : t
      )
    );

    // Update profile
    const newTotalXP = userProfile.totalXP + totalXP;
    const newLevel = calculateLevel(newTotalXP);
    const { currentXP, xpNeeded } = getCurrentLevelProgress(newTotalXP);
    const didLevelUp = newLevel > userProfile.level;

    setUserProfile((prev) => ({
      ...prev,
      xp: currentXP,
      xpToNextLevel: xpNeeded,
      totalXP: newTotalXP,
      level: newLevel,
      totalTasksCompleted: prev.totalTasksCompleted + 1,
    }));

    // Check achievements
    checkAchievements(newLevel, userProfile.totalTasksCompleted + 1, userProfile.currentStreak);

    // Show toast with confetti effect
    if (didLevelUp) {
      toast.success(`🎉 LEVEL UP! You're now level ${newLevel}! +${totalXP} XP`, {
        duration: 3000,
      });
    } else {
      toast.success(`✨ +${totalXP} XP! ${task.name} completed!`, {
        duration: 2000,
      });
    }
  };

  // Uncomplete task
  const handleUncompleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const xpLost = task.difficulty * 10;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, completed: false, completedAt: undefined }
          : t
      )
    );

    // Update profile (remove XP)
    const newTotalXP = Math.max(0, userProfile.totalXP - xpLost);
    const newLevel = calculateLevel(newTotalXP);
    const { currentXP, xpNeeded } = getCurrentLevelProgress(newTotalXP);

    setUserProfile((prev) => ({
      ...prev,
      xp: currentXP,
      xpToNextLevel: xpNeeded,
      totalXP: newTotalXP,
      level: newLevel,
      totalTasksCompleted: Math.max(0, prev.totalTasksCompleted - 1),
    }));

    toast.info(`Task unmarked. -${xpLost} XP`);
  };

  // Check and unlock achievements
  const checkAchievements = (level: number, tasksCompleted: number, streak: number) => {
    setAchievements((prev) =>
      prev.map((achievement) => {
        if (achievement.unlocked) return achievement;

        let shouldUnlock = false;
        if (achievement.id === "first-task" && tasksCompleted >= 1) shouldUnlock = true;
        if (achievement.id === "tasks-50" && tasksCompleted >= 50) shouldUnlock = true;
        if (achievement.id === "tasks-100" && tasksCompleted >= 100) shouldUnlock = true;
        if (achievement.id === "streak-3" && streak >= 3) shouldUnlock = true;
        if (achievement.id === "streak-7" && streak >= 7) shouldUnlock = true;
        if (achievement.id === "streak-30" && streak >= 30) shouldUnlock = true;
        if (achievement.id === "level-5" && level >= 5) shouldUnlock = true;
        if (achievement.id === "level-10" && level >= 10) shouldUnlock = true;

        if (shouldUnlock) {
          toast.success(`🏆 Achievement Unlocked: ${achievement.title}!`, {
            duration: 3000,
          });
          return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() };
        }

        return achievement;
      })
    );
  };

  // Check if task should appear today
  const shouldShowTask = (task: Task): boolean => {
    const today = new Date().getDay();
    if (task.frequency === "Daily") return true;
    if (task.frequency === "One-time") return true;
    if (task.frequency === "Selected Days" && task.selectedDays) {
      return task.selectedDays.includes(today);
    }
    return false;
  };

  // Filter tasks based on active tab and filters
  const getFilteredTasks = () => {
    let visibleTasks = tasks.filter((task) => shouldShowTask(task));
    
    // Apply category filter
    if (filters.categories.length > 0) {
      visibleTasks = visibleTasks.filter((task) =>
        filters.categories.includes(task.category)
      );
    }
    
    // Apply frequency filter
    if (filters.frequencies.length > 0) {
      visibleTasks = visibleTasks.filter((task) =>
        filters.frequencies.includes(task.frequency)
      );
    }
    
    switch (activeTab) {
      case "pending":
        return visibleTasks.filter((task) => !task.completed);
      case "completed":
        return visibleTasks.filter((task) => task.completed);
      case "all":
      default:
        return visibleTasks;
    }
  };

  const filteredTasks = getFilteredTasks();
  
  // Get filtered counts (respecting active filters)
  const getFilteredCount = (completedStatus?: boolean) => {
    let visibleTasks = tasks.filter((task) => shouldShowTask(task));
    
    // Apply category filter
    if (filters.categories.length > 0) {
      visibleTasks = visibleTasks.filter((task) =>
        filters.categories.includes(task.category)
      );
    }
    
    // Apply frequency filter
    if (filters.frequencies.length > 0) {
      visibleTasks = visibleTasks.filter((task) =>
        filters.frequencies.includes(task.frequency)
      );
    }
    
    if (completedStatus === undefined) {
      return visibleTasks.length;
    }
    return visibleTasks.filter((task) => task.completed === completedStatus).length;
  };
  
  const allCount = getFilteredCount();
  const pendingCount = getFilteredCount(false);
  const completedCount = getFilteredCount(true);

  // Calculate stats
  const last7Days = dailyStats.slice(-7);
  const last30Days = dailyStats.slice(-30);

  const weeklyCompletedTasks = last7Days.reduce((sum, day) => sum + day.tasksCompleted, 0);
  const weeklyTotalTasks = last7Days.reduce((sum, day) => sum + day.totalTasks, 0);
  const weeklyCompletion = weeklyTotalTasks > 0
    ? Math.round((weeklyCompletedTasks / weeklyTotalTasks) * 100)
    : 0;

  const monthlyCompletedTasks = last30Days.reduce((sum, day) => sum + day.tasksCompleted, 0);
  const monthlyTotalTasks = last30Days.reduce((sum, day) => sum + day.totalTasks, 0);
  const monthlyCompletion = monthlyTotalTasks > 0
    ? Math.round((monthlyCompletedTasks / monthlyTotalTasks) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050510] via-[#0a0a20] to-[#0f0f28] pb-32">
      {/* PWA Meta Tags */}
      <PWAHead />
      
      {/* PWA Status Badge */}
      <PWAStatus />
      
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(15, 15, 35, 0.95)",
            border: "1px solid rgba(0, 212, 255, 0.3)",
            color: "#fff",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
          },
        }}
      />
      
      {/* PWA Install Prompt */}
      <PWAInstall />

      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]"
        />
      </div>

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                MindForge
              </h1>
            </div>
            <p className="text-sm text-gray-400">
              {activeView === "tasks" && "Track your daily momentum"}
              {activeView === "stats" && "Your progress insights"}
              {activeView === "profile" && "Your journey"}
            </p>
          </motion.div>

          {/* Date Display - Show only on tasks view */}
          {activeView === "tasks" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glassmorphism rounded-3xl p-5 neon-border-cyan mb-4"
              style={{
                background: "linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(139,92,246,0.1) 100%)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center neon-glow-cyan">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-white mb-0.5">{formatDate(currentDate)}</h2>
                  <p className="text-sm text-gray-400">{getISTTimeString()} IST</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Level Display - Show only on tasks view */}
          {activeView === "tasks" && <LevelDisplay profile={userProfile} />}

          {/* Tabs and Filter - Show only on tasks view */}
          {activeView === "tasks" && (
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glassmorphism rounded-3xl p-1.5 flex gap-1"
              >
                <TabButton
                  label="All"
                  count={allCount}
                  isActive={activeTab === "all"}
                  onClick={() => setActiveTab("all")}
                />
                <TabButton
                  label="Pending"
                  count={pendingCount}
                  isActive={activeTab === "pending"}
                  onClick={() => setActiveTab("pending")}
                />
                <TabButton
                  label="Completed"
                  count={completedCount}
                  isActive={activeTab === "completed"}
                  onClick={() => setActiveTab("completed")}
                />
              </motion.div>
              
              {/* Filter Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFilterOpen(true)}
                className={`w-full glassmorphism rounded-2xl p-3 flex items-center justify-between transition-all ${
                  filters.categories.length > 0 || filters.frequencies.length > 0
                    ? "border-2 border-cyan-400 neon-glow-cyan"
                    : "border border-gray-600/30 hover:border-cyan-500/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-gray-300">
                    {filters.categories.length > 0 || filters.frequencies.length > 0
                      ? `${filters.categories.length + filters.frequencies.length} filter${
                          filters.categories.length + filters.frequencies.length > 1 ? "s" : ""
                        } active`
                      : "Filter tasks"}
                  </span>
                </div>
                {(filters.categories.length > 0 || filters.frequencies.length > 0) && (
                  <span className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-xs text-cyan-400">
                    {filters.categories.length + filters.frequencies.length}
                  </span>
                )}
              </motion.button>
            </div>
          )}
        </div>

        {/* View Content */}
        <div className="px-6">
          <AnimatePresence mode="wait">
            {activeView === "tasks" && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {filteredTasks.length > 0 ? (
                  <AnimatePresence mode="popLayout">
                    {filteredTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onComplete={handleCompleteTask}
                        onUncomplete={handleUncompleteTask}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </AnimatePresence>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center py-20"
                  >
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="mb-4"
                    >
                      <Sparkles className="w-16 h-16 mx-auto text-cyan-400/50" />
                    </motion.div>
                    <h3 className="text-gray-400 mb-2">
                      {filters.categories.length > 0 || filters.frequencies.length > 0
                        ? "No tasks match your filters"
                        : activeTab === "completed"
                        ? "No completed tasks"
                        : activeTab === "pending"
                        ? "No pending tasks"
                        : "No tasks yet"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {filters.categories.length > 0 || filters.frequencies.length > 0 ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setFilters({ categories: [], frequencies: [] })}
                          className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-400 transition-all"
                        >
                          Clear Filters
                        </motion.button>
                      ) : (
                        activeTab === "all" && "Tap the + button to create your first task"
                      )}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeView === "stats" && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <StatsPanel
                  dailyStats={dailyStats}
                  weeklyCompletion={weeklyCompletion}
                  monthlyCompletion={monthlyCompletion}
                />
              </motion.div>
            )}

            {activeView === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <ProfileView profile={userProfile} achievements={achievements} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Add Button - Show only on tasks view */}
      {activeView === "tasks" && (
        <FloatingAddButton onClick={() => {
          setEditingTask(null);
          setIsModalOpen(true);
        }} />
      )}

      {/* Bottom Navigation */}
      <BottomNav activeView={activeView} onViewChange={setActiveView} />

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleAddTask}
        editTask={editingTask}
      />

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        activeFilters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}

export default App;
