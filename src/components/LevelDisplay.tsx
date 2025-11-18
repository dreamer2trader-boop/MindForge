import { motion } from "motion/react";
import { Sparkles, TrendingUp, Flame } from "lucide-react";
import { UserProfile } from "../types";
import { getLevelTitle, getMentalStrengthScore, getMentalStrengthColor, getStreakBonus } from "../utils/gamification";

interface LevelDisplayProps {
  profile: UserProfile;
}

export function LevelDisplay({ profile }: LevelDisplayProps) {
  const progress = (profile.xp / profile.xpToNextLevel) * 100;
  const mentalStrength = getMentalStrengthScore(profile);
  const strengthColor = getMentalStrengthColor(mentalStrength);
  const streakBonus = getStreakBonus(profile.currentStreak);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glassmorphism rounded-3xl p-5 neon-border-cyan mb-4"
    >
      {/* Level and Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center neon-glow-cyan"
          >
            <Sparkles className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-white">Level {profile.level}</h2>
              {streakBonus > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-0.5 rounded-lg bg-orange-500/20 border border-orange-400/30 text-orange-400 text-xs"
                >
                  +{streakBonus}% XP
                </motion.div>
              )}
            </div>
            <p className="text-sm text-cyan-400">{getLevelTitle(profile.level)}</p>
          </div>
        </div>

        {/* Streak */}
        {profile.currentStreak > 0 && (
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30"
          >
            <Flame className="w-5 h-5 text-orange-400" />
            <div className="text-right">
              <div className="text-sm text-white">{profile.currentStreak}</div>
              <div className="text-xs text-orange-400">day streak</div>
            </div>
          </motion.div>
        )}
      </div>

      {/* XP Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Experience</span>
          <span className="text-sm text-cyan-400">
            {profile.xp} / {profile.xpToNextLevel} XP
          </span>
        </div>
        <div className="relative h-3 bg-gray-800/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full"
          />
          <motion.div
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />
        </div>
      </div>

      {/* Mental Strength Score */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">Mental Strength</span>
          </div>
          <span className={`text-sm bg-gradient-to-r ${strengthColor} bg-clip-text text-transparent`}>
            {mentalStrength}/100
          </span>
        </div>
        <div className="relative h-3 bg-gray-800/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${mentalStrength}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${strengthColor} rounded-full`}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="text-center p-3 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20">
          <div className="text-lg text-white">{profile.totalTasksCompleted}</div>
          <div className="text-xs text-gray-400">Tasks</div>
        </div>
        <div className="text-center p-3 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20">
          <div className="text-lg text-white">{profile.totalXP}</div>
          <div className="text-xs text-gray-400">Total XP</div>
        </div>
        <div className="text-center p-3 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-400/20">
          <div className="text-lg text-white">{profile.longestStreak}</div>
          <div className="text-xs text-gray-400">Best Streak</div>
        </div>
      </div>
    </motion.div>
  );
}
