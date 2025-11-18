import { forwardRef } from "react";
import { motion } from "motion/react";
import { Check, Clock, Trash2, Edit3 } from "lucide-react";
import { CategoryBadge, type TaskCategory } from "./CategoryBadge";
import { FrequencyBadge } from "./FrequencyBadge";

export interface Task {
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  frequency: "Daily" | "Selected Days" | "One-time";
  selectedDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem = forwardRef<HTMLDivElement, TaskItemProps>(
  ({ task, onToggle, onDelete, onEdit }, ref) => {
  const handleToggle = () => {
    onToggle(task.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`glassmorphism rounded-3xl p-4 mb-3 transition-all duration-300 ${
        task.completed ? "opacity-70" : "hover:bg-opacity-80"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleToggle}
          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
            task.completed
              ? "bg-gradient-to-br from-cyan-500 to-purple-600 border-cyan-400 neon-glow-cyan"
              : "border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-500/10"
          }`}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className={`transition-all duration-300 flex-1 ${
                task.completed ? "line-through text-gray-400" : "text-white"
              }`}
            >
              {task.name}
            </h3>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleEdit}
                className="w-7 h-7 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 flex items-center justify-center border border-blue-400/30 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-400" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="w-7 h-7 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center border border-red-400/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </motion.button>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-2">
            <CategoryBadge category={task.category} size="sm" />
            <FrequencyBadge frequency={task.frequency} size="sm" />
          </div>

          {task.description && (
            <p className="text-sm text-gray-400 mb-2">{task.description}</p>
          )}

          {/* Completion Timestamp */}
          {task.completed && task.completedAt && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1 text-xs text-cyan-400 mt-2"
            >
              <Clock className="w-3 h-3" />
              <span>Completed at {task.completedAt}</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

TaskItem.displayName = "TaskItem";
