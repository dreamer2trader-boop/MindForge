import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip } from "recharts";
import { Calendar, TrendingUp, Award, Target } from "lucide-react";
import { DailyStats } from "../types";
import { TaskCategory } from "./CategoryBadge";

interface StatsPanelProps {
  dailyStats: DailyStats[];
  weeklyCompletion: number;
  monthlyCompletion: number;
}

const CATEGORY_COLORS: { [key in TaskCategory]: string } = {
  Personal: "#00d4ff",
  Trading: "#3b82f6",
  Career: "#8b5cf6",
  Mindfulness: "#ec4899",
  Work: "#d946ef",
  Health: "#f59e0b",
  Fitness: "#10b981",
};

export function StatsPanel({ dailyStats, weeklyCompletion, monthlyCompletion }: StatsPanelProps) {
  // Get last 7 days for charts
  const last7Days = dailyStats.slice(-7);
  
  // Prepare data for completion chart
  const completionData = last7Days.map((day) => ({
    date: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
    completed: day.tasksCompleted,
    total: day.totalTasks,
    xp: day.xpEarned,
  }));

  // Prepare category breakdown data
  const categoryData: { name: string; value: number; color: string }[] = [];
  const categoryCounts: { [key: string]: number } = {};

  dailyStats.forEach((day) => {
    Object.entries(day.categories).forEach(([category, count]) => {
      categoryCounts[category] = (categoryCounts[category] || 0) + count;
    });
  });

  Object.entries(categoryCounts).forEach(([category, count]) => {
    categoryData.push({
      name: category,
      value: count,
      color: CATEGORY_COLORS[category as TaskCategory] || "#ffffff",
    });
  });

  const totalXP = dailyStats.reduce((sum, day) => sum + day.xpEarned, 0);
  const totalCompleted = dailyStats.reduce((sum, day) => sum + day.tasksCompleted, 0);
  const totalTasks = dailyStats.reduce((sum, day) => sum + day.totalTasks, 0);
  const avgCompletionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphism rounded-3xl p-4 border-cyan-400/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-400">Week</span>
          </div>
          <div className="text-2xl text-white mb-1">{weeklyCompletion}%</div>
          <div className="text-xs text-gray-500">Completion rate</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glassmorphism rounded-3xl p-4 border-purple-400/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-400">Month</span>
          </div>
          <div className="text-2xl text-white mb-1">{monthlyCompletion}%</div>
          <div className="text-xs text-gray-500">Completion rate</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glassmorphism rounded-3xl p-4 border-orange-400/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-400">Total XP</span>
          </div>
          <div className="text-2xl text-white mb-1">{totalXP}</div>
          <div className="text-xs text-gray-500">Experience earned</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glassmorphism rounded-3xl p-4 border-green-400/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-400">Avg Rate</span>
          </div>
          <div className="text-2xl text-white mb-1">{avgCompletionRate}%</div>
          <div className="text-xs text-gray-500">Overall completion</div>
        </motion.div>
      </div>

      {/* Daily Completion Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glassmorphism rounded-3xl p-5"
      >
        <h3 className="text-white mb-4">Last 7 Days</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={completionData}>
            <XAxis
              dataKey="date"
              stroke="#666"
              tick={{ fill: "#888", fontSize: 12 }}
            />
            <YAxis stroke="#666" tick={{ fill: "#888", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 15, 35, 0.95)",
                border: "1px solid rgba(0, 212, 255, 0.3)",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
            <Bar
              dataKey="completed"
              fill="url(#colorGradient)"
              radius={[8, 8, 0, 0]}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* XP Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glassmorphism rounded-3xl p-5"
      >
        <h3 className="text-white mb-4">XP Earned</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={completionData}>
            <XAxis
              dataKey="date"
              stroke="#666"
              tick={{ fill: "#888", fontSize: 12 }}
            />
            <YAxis stroke="#666" tick={{ fill: "#888", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 15, 35, 0.95)",
                border: "1px solid rgba(0, 212, 255, 0.3)",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="xp"
              stroke="#00d4ff"
              strokeWidth={3}
              dot={{ fill: "#00d4ff", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glassmorphism rounded-3xl p-5"
        >
          <h3 className="text-white mb-4">Category Breakdown</h3>
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {categoryData.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-gray-300">{category.name}</span>
                </div>
                <span className="text-sm text-gray-400">{category.value} tasks</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
