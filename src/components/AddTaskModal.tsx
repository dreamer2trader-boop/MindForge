import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Clock, Star, Zap } from "lucide-react";
import { type TaskCategory } from "./CategoryBadge";
import { type Task } from "../types";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: {
    name: string;
    description: string;
    category: TaskCategory;
    frequency: "Daily" | "Selected Days" | "One-time";
    selectedDays?: number[];
    difficulty: number;
  }) => void;
  editTask?: Task | null;
}

const categories: TaskCategory[] = [
  "Personal",
  "Trading",
  "Career",
  "Mindfulness",
  "Work",
  "Health",
  "Fitness",
];

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AddTaskModal({ isOpen, onClose, onSave, editTask }: AddTaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TaskCategory>("Personal");
  const [frequency, setFrequency] = useState<"Daily" | "Selected Days" | "One-time">("Daily");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState(3);

  // Populate form when editing
  useEffect(() => {
    if (editTask) {
      setTaskName(editTask.name);
      setDescription(editTask.description);
      setCategory(editTask.category);
      setFrequency(editTask.frequency);
      setSelectedDays(editTask.selectedDays || []);
      setDifficulty(editTask.difficulty || 3);
    } else {
      // Reset form when not editing
      setTaskName("");
      setDescription("");
      setCategory("Personal");
      setFrequency("Daily");
      setSelectedDays([]);
      setDifficulty(3);
    }
  }, [editTask, isOpen]);

  const handleSave = () => {
    if (!taskName.trim()) return;

    onSave({
      name: taskName,
      description,
      category,
      frequency,
      selectedDays: frequency === "Selected Days" ? selectedDays : undefined,
      difficulty,
    });

    // Reset form
    setTaskName("");
    setDescription("");
    setCategory("Personal");
    setFrequency("Daily");
    setSelectedDays([]);
    setDifficulty(3);
    onClose();
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md glassmorphism rounded-3xl p-6 z-50 max-h-[80vh] overflow-y-auto"
            style={{
              boxShadow: "0 0 40px rgba(0,212,255,0.2), 0 0 80px rgba(139,92,246,0.1)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white">{editTask ? "Edit Task" : "Add New Task"}</h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-300" />
              </motion.button>
            </div>

            {/* Task Name */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Task Name</label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name..."
                className="w-full px-4 py-3 rounded-2xl glassmorphism-light text-white placeholder-gray-500 border border-cyan-500/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description (optional)..."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl glassmorphism-light text-white placeholder-gray-500 border border-cyan-500/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none"
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-xl transition-all ${
                      category === cat
                        ? "bg-gradient-to-br from-cyan-500/30 to-purple-600/30 border-2 border-cyan-400 text-white neon-glow-cyan"
                        : "glassmorphism-light border border-gray-600/30 text-gray-300 hover:border-cyan-500/50"
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Frequency
              </label>
              <div className="flex gap-2 mb-3">
                {(["Daily", "Selected Days", "One-time"] as const).map((freq) => (
                  <motion.button
                    key={freq}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFrequency(freq)}
                    className={`flex-1 px-3 py-2 rounded-xl text-sm transition-all ${
                      frequency === freq
                        ? "bg-gradient-to-br from-purple-500/30 to-pink-600/30 border-2 border-purple-400 text-white neon-glow-purple"
                        : "glassmorphism-light border border-gray-600/30 text-gray-300 hover:border-purple-500/50"
                    }`}
                  >
                    {freq}
                  </motion.button>
                ))}
              </div>

              {/* Selected Days Grid */}
              {frequency === "Selected Days" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-7 gap-2"
                >
                  {weekdays.map((day, index) => (
                    <motion.button
                      key={day}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleDay(index)}
                      className={`aspect-square rounded-xl text-[10px] flex items-center justify-center transition-all ${
                        selectedDays.includes(index)
                          ? "bg-gradient-to-br from-cyan-500 to-purple-600 text-white border-2 border-cyan-400 neon-glow-cyan"
                          : "glassmorphism-light border border-gray-600/30 text-gray-400 hover:border-cyan-500/50 hover:text-gray-300"
                      }`}
                    >
                      {day}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Difficulty */}
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Difficulty (affects XP reward)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <motion.button
                    key={level}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setDifficulty(level)}
                    className={`flex-1 aspect-square rounded-xl transition-all flex flex-col items-center justify-center gap-1 ${
                      difficulty >= level
                        ? "bg-gradient-to-br from-yellow-500/30 to-orange-600/30 border-2 border-yellow-400 text-white"
                        : "glassmorphism-light border border-gray-600/30 text-gray-400 hover:border-yellow-500/50"
                    }`}
                  >
                    <Star className={`w-4 h-4 ${difficulty >= level ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    <span className="text-[10px]">{level * 10}XP</span>
                  </motion.button>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span>Higher difficulty = More XP reward</span>
              </div>
            </div>

            {/* IST Info */}
            <div className="mb-6 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-blue-300">Time tracking uses Indian Standard Time (IST)</span>
            </div>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={!taskName.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              style={{
                boxShadow: taskName.trim()
                  ? "0 0 20px rgba(0,212,255,0.4), 0 0 40px rgba(139,92,246,0.2)"
                  : "none",
              }}
            >
              <span>{editTask ? "Update Task" : "Save Task"}</span>
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
