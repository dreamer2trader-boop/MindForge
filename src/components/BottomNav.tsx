import { motion } from "motion/react";
import { ListTodo, BarChart3, User } from "lucide-react";

interface BottomNavProps {
  activeView: "tasks" | "stats" | "profile";
  onViewChange: (view: "tasks" | "stats" | "profile") => void;
}

export function BottomNav({ activeView, onViewChange }: BottomNavProps) {
  const navItems = [
    { id: "tasks" as const, icon: ListTodo, label: "Tasks" },
    { id: "stats" as const, icon: BarChart3, label: "Stats" },
    { id: "profile" as const, icon: User, label: "Profile" },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 pb-safe"
    >
      <div className="mx-4 mb-4 glassmorphism rounded-3xl p-2 neon-border-cyan">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewChange(item.id)}
                className={`relative flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl transition-all ${
                  isActive ? "text-cyan-400" : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-2xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? "neon-glow-cyan" : ""}`} />
                <span className="text-xs relative z-10">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
