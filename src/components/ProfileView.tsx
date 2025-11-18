import { motion } from "motion/react";
import { Trophy, Award, Target, TrendingUp, Calendar, Zap } from "lucide-react";
import { UserProfile, Achievement } from "../types";
import { getLevelTitle } from "../utils/gamification";

interface ProfileViewProps {
  profile: UserProfile;
  achievements: Achievement[];
}

export function ProfileView({ profile, achievements }: ProfileViewProps) {
  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const joinDate = new Date(profile.joinedDate).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glassmorphism rounded-3xl p-6 text-center"
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 via-purple-600 to-pink-600 flex items-center justify-center neon-glow-cyan"
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>
        <h2 className="text-white mb-1">Level {profile.level}</h2>
        <p className="text-cyan-400 mb-2">{getLevelTitle(profile.level)}</p>
        <p className="text-sm text-gray-400">Member since {joinDate}</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="glassmorphism rounded-3xl p-4 border border-cyan-400/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-gray-400">Total Tasks</span>
          </div>
          <div className="text-2xl text-white">{profile.totalTasksCompleted}</div>
        </div>

        <div className="glassmorphism rounded-3xl p-4 border border-purple-400/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-gray-400">Total XP</span>
          </div>
          <div className="text-2xl text-white">{profile.totalXP}</div>
        </div>

        <div className="glassmorphism rounded-3xl p-4 border border-orange-400/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-gray-400">Current Streak</span>
          </div>
          <div className="text-2xl text-white">{profile.currentStreak} days</div>
        </div>

        <div className="glassmorphism rounded-3xl p-4 border border-green-400/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm text-gray-400">Best Streak</span>
          </div>
          <div className="text-2xl text-white">{profile.longestStreak} days</div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glassmorphism rounded-3xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-yellow-400" />
          <h3 className="text-white">Achievements</h3>
          <span className="ml-auto text-sm text-gray-400">
            {unlockedAchievements.length}/{achievements.length}
          </span>
        </div>

        <div className="space-y-3">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-2xl transition-all ${
                achievement.unlocked
                  ? "bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border border-yellow-400/30"
                  : "bg-gray-800/30 border border-gray-700/30 opacity-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`text-3xl ${achievement.unlocked ? "" : "grayscale opacity-50"}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className={achievement.unlocked ? "text-white" : "text-gray-500"}>
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-yellow-400 mt-2">
                      Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString("en-IN")}
                    </p>
                  )}
                </div>
                {achievement.unlocked && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
                  >
                    <span className="text-sm">✓</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
