import { motion } from "motion/react";
import { Plus } from "lucide-react";

interface FloatingAddButtonProps {
  onClick: () => void;
}

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(0,212,255,0.5)] z-50"
      style={{
        boxShadow: "0 0 30px rgba(0,212,255,0.5), 0 0 60px rgba(139,92,246,0.3)",
      }}
    >
      {/* Animated Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-cyan-400/50"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
    </motion.button>
  );
}
