import { motion, AnimatePresence } from "motion/react";
import { Filter, X } from "lucide-react";
import { TaskCategory } from "./CategoryBadge";

export type FilterOptions = {
  categories: TaskCategory[];
  frequencies: ("Daily" | "Selected Days" | "One-time")[];
};

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
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

const frequencies: ("Daily" | "Selected Days" | "One-time")[] = [
  "Daily",
  "Selected Days",
  "One-time",
];

const frequencyLabels = {
  "Daily": "Daily",
  "Selected Days": "Custom Days",
  "One-time": "One-time",
};

export function FilterPanel({ isOpen, onClose, activeFilters, onFiltersChange }: FilterPanelProps) {
  const toggleCategory = (category: TaskCategory) => {
    const newCategories = activeFilters.categories.includes(category)
      ? activeFilters.categories.filter((c) => c !== category)
      : [...activeFilters.categories, category];
    onFiltersChange({ ...activeFilters, categories: newCategories });
  };

  const toggleFrequency = (frequency: "Daily" | "Selected Days" | "One-time") => {
    const newFrequencies = activeFilters.frequencies.includes(frequency)
      ? activeFilters.frequencies.filter((f) => f !== frequency)
      : [...activeFilters.frequencies, frequency];
    onFiltersChange({ ...activeFilters, frequencies: newFrequencies });
  };

  const clearAllFilters = () => {
    onFiltersChange({ categories: [], frequencies: [] });
  };

  const hasActiveFilters = activeFilters.categories.length > 0 || activeFilters.frequencies.length > 0;

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

          {/* Filter Panel */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 glassmorphism rounded-t-3xl z-50 max-h-[80vh] overflow-y-auto"
            style={{
              boxShadow: "0 0 40px rgba(0,212,255,0.2), 0 0 80px rgba(139,92,246,0.1)",
            }}
          >
            {/* Header */}
            <div className="sticky top-0 glassmorphism border-b border-cyan-500/20 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-cyan-400" />
                <h2 className="text-white">Filters</h2>
                {hasActiveFilters && (
                  <span className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-xs text-cyan-400">
                    {activeFilters.categories.length + activeFilters.frequencies.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearAllFilters}
                    className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-400 rounded-xl text-sm transition-all"
                  >
                    Clear All
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-300" />
                </motion.button>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  Category
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => {
                    const isActive = activeFilters.categories.includes(category);
                    return (
                      <motion.button
                        key={category}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleCategory(category)}
                        className={`px-4 py-3 rounded-2xl transition-all text-sm ${
                          isActive
                            ? "bg-gradient-to-br from-cyan-500/30 to-purple-600/30 border-2 border-cyan-400 text-white neon-glow-cyan"
                            : "glassmorphism-light border border-gray-600/30 text-gray-300 hover:border-cyan-500/50"
                        }`}
                      >
                        {category}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Frequency Filter */}
              <div>
                <h3 className="text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  Timeline
                </h3>
                <div className="flex flex-col gap-2">
                  {frequencies.map((frequency) => {
                    const isActive = activeFilters.frequencies.includes(frequency);
                    return (
                      <motion.button
                        key={frequency}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleFrequency(frequency)}
                        className={`px-4 py-3 rounded-2xl transition-all flex items-center justify-between ${
                          isActive
                            ? "bg-gradient-to-br from-purple-500/30 to-pink-600/30 border-2 border-purple-400 text-white neon-glow-purple"
                            : "glassmorphism-light border border-gray-600/30 text-gray-300 hover:border-purple-500/50"
                        }`}
                      >
                        <span>{frequencyLabels[frequency]}</span>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center"
                          >
                            <span className="text-xs">✓</span>
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Apply Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white transition-all"
                style={{
                  boxShadow: "0 0 20px rgba(0,212,255,0.4), 0 0 40px rgba(139,92,246,0.2)",
                }}
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
