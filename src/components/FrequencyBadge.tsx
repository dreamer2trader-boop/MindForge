import { motion } from "motion/react";
import { Calendar, CalendarDays, CalendarClock } from "lucide-react";

interface FrequencyBadgeProps {
  frequency: "Daily" | "Selected Days" | "One-time";
  size?: "sm" | "md";
}

export function FrequencyBadge({ frequency, size = "sm" }: FrequencyBadgeProps) {
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs";

  const config = {
    Daily: {
      icon: CalendarDays,
      bg: "bg-blue-500/20",
      text: "text-blue-300",
      border: "border-blue-400/30",
      label: "Daily",
    },
    "Selected Days": {
      icon: Calendar,
      bg: "bg-purple-500/20",
      text: "text-purple-300",
      border: "border-purple-400/30",
      label: "Custom",
    },
    "One-time": {
      icon: CalendarClock,
      bg: "bg-amber-500/20",
      text: "text-amber-300",
      border: "border-amber-400/30",
      label: "Today",
    },
  };

  const { icon: Icon, bg, text, border, label } = config[frequency];

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1 rounded-full ${bg} ${text} ${sizeClass} border ${border}`}
    >
      <Icon className="w-3 h-3" />
      <span>{label}</span>
    </motion.span>
  );
}
