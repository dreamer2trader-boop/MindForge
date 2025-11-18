import { motion } from "motion/react";

export type TaskCategory = "Personal" | "Trading" | "Career" | "Mindfulness" | "Work" | "Health" | "Fitness";

interface CategoryBadgeProps {
  category: TaskCategory;
  size?: "sm" | "md";
}

const categoryColors: Record<TaskCategory, { bg: string; text: string; glow: string }> = {
  Personal: { bg: "bg-purple-500/20", text: "text-purple-300", glow: "shadow-[0_0_10px_rgba(168,85,247,0.4)]" },
  Trading: { bg: "bg-cyan-500/20", text: "text-cyan-300", glow: "shadow-[0_0_10px_rgba(6,182,212,0.4)]" },
  Career: { bg: "bg-blue-500/20", text: "text-blue-300", glow: "shadow-[0_0_10px_rgba(59,130,246,0.4)]" },
  Mindfulness: { bg: "bg-pink-500/20", text: "text-pink-300", glow: "shadow-[0_0_10px_rgba(236,72,153,0.4)]" },
  Work: { bg: "bg-indigo-500/20", text: "text-indigo-300", glow: "shadow-[0_0_10px_rgba(99,102,241,0.4)]" },
  Health: { bg: "bg-emerald-500/20", text: "text-emerald-300", glow: "shadow-[0_0_10px_rgba(16,185,129,0.4)]" },
  Fitness: { bg: "bg-orange-500/20", text: "text-orange-300", glow: "shadow-[0_0_10px_rgba(249,115,22,0.4)]" },
};

export function CategoryBadge({ category, size = "md" }: CategoryBadgeProps) {
  const colors = categoryColors[category];
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs";

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center rounded-full ${colors.bg} ${colors.text} ${colors.glow} ${sizeClass} border border-current/20`}
    >
      {category}
    </motion.span>
  );
}
