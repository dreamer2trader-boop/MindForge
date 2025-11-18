import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Task } from "../types";
import { Settings, Trash2, Zap, Star } from "lucide-react";
import { CategoryBadge } from "./CategoryBadge";
import { FrequencyBadge } from "./FrequencyBadge";

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onUncomplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const difficultyStars = (difficulty: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-3 h-3 ${
        i < difficulty
          ? "fill-yellow-400 text-yellow-400"
          : "text-gray-600"
      }`}
    />
  ));
};

export function TaskCard({ task, onComplete, onUncomplete, onEdit, onDelete }: TaskCardProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isCompleted = task.completed;
  const xpReward = task.difficulty * 10;

  const startHold = () => {
    if (isCompleted) return;

    setIsHolding(true);
    let progress = 0;

    progressIntervalRef.current = setInterval(() => {
      progress += 2;
      setHoldProgress(progress);
    }, 20);

    holdTimerRef.current = setTimeout(() => {
      handleComplete();
    }, 1000);
  };

  const endHold = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  const handleComplete = () => {
    setIsHolding(false);
    setHoldProgress(0);
    onComplete(task.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative mb-3"
    >
      <div
        className={`relative overflow-hidden rounded-3xl transition-all duration-300 ${
          isCompleted
            ? "glassmorphism-light opacity-70"
            : "glassmorphism hover:bg-opacity-80"
        }`}
      >
        {/* Hold to complete area */}
        <div
          className={`relative ${isCompleted ? "" : "cursor-pointer select-none active:scale-[0.98]"} transition-transform`}
          onMouseDown={isCompleted ? undefined : startHold}
          onMouseUp={isCompleted ? undefined : endHold}
          onMouseLeave={isCompleted ? undefined : endHold}
          onTouchStart={isCompleted ? undefined : startHold}
          onTouchEnd={isCompleted ? undefined : endHold}
        >
          {/* Progress overlay */}
          {isHolding && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 z-10"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: holdProgress / 100 }}
              style={{ transformOrigin: "left" }}
            />
          )}

          {/* Glow effect on hold */}
          {isHolding && (
            <motion.div
              className="absolute inset-0 z-0"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(0, 212, 255, 0.3)",
                  "0 0 40px rgba(139, 92, 246, 0.4)",
                  "0 0 20px rgba(0, 212, 255, 0.3)",
                ],
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}

          {/* Card content */}
          <div className="relative z-20 p-4">
            <div className="flex items-start gap-3">
              {/* Task details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`flex-1 ${isCompleted ? "line-through text-gray-400" : "text-white"}`}>
                    {task.name}
                  </h3>
                  
                  {/* Action Buttons */}
                  {!isCompleted && (
                    <div
                      className="flex items-center gap-1.5 flex-shrink-0"
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onEdit(task);
                        }}
                        className="w-8 h-8 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 flex items-center justify-center border border-blue-400/30 transition-all"
                      >
                        <Settings className="w-4 h-4 text-blue-400" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onDelete(task.id);
                        }}
                        className="w-8 h-8 rounded-xl bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center border border-red-400/30 transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <CategoryBadge category={task.category} size="sm" />
                  <FrequencyBadge frequency={task.frequency} size="sm" />
                  
                  {/* Difficulty stars */}
                  <div className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    {difficultyStars(task.difficulty)}
                  </div>
                </div>

                {task.description && (
                  <p className={`text-sm mb-3 ${isCompleted ? "text-gray-500" : "text-gray-400"}`}>
                    {task.description}
                  </p>
                )}

                {/* XP Reward / Completion info */}
                <div className="flex items-center justify-between">
                  {!isCompleted ? (
                    <motion.div
                      animate={isHolding ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 0.3, repeat: isHolding ? Infinity : 0 }}
                      className="flex items-center gap-1.5 text-sm"
                    >
                      <div className="flex items-center gap-1 text-cyan-400">
                        <Zap className="w-4 h-4" />
                        <span>+{xpReward} XP</span>
                      </div>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">Hold to complete</span>
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg neon-glow-cyan"
                      >
                        <span className="text-sm">✓</span>
                      </motion.div>
                      <span className="text-sm text-cyan-400">
                        {task.completedAt ? `Completed at ${task.completedAt}` : "Completed"}
                      </span>
                    </div>
                  )}

                  {isCompleted && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUncomplete(task.id);
                      }}
                      className="px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/30 text-orange-400 rounded-xl transition-all text-sm"
                    >
                      Undo
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
