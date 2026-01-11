"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Trophy,
  Crown,
  Star,
  Award,
  Shield,
  User,
  ArrowLeft,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  userPhone: string;
  problemsReported: number;
  upvotesGiven: number;
  verificationsGiven: number;
  responsesOffered: number;
  totalContributions: number;
  score: number;
  badge: {
    name: string;
    icon: string;
    color: string;
  };
}

const BADGE_ICONS: Record<string, React.ElementType> = {
  trophy: Trophy,
  crown: Crown,
  star: Star,
  award: Award,
  shield: Shield,
  user: User,
};

const RANK_STYLES = [
  { bg: "from-amber-500 to-yellow-600", ring: "ring-amber-500/30", shadow: "shadow-amber-500/30" },
  { bg: "from-gray-400 to-gray-500", ring: "ring-gray-400/30", shadow: "shadow-gray-400/30" },
  { bg: "from-amber-700 to-orange-800", ring: "ring-amber-700/30", shadow: "shadow-amber-700/30" },
];

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/leaderboard");
      const data = await response.json();
      if (data.success) {
        setLeaderboard(data.leaderboard);
      } else {
        setError("Failed to load leaderboard");
      }
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <>
      {/* Header */}
      <header className="header-glass sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-xl hover:bg-white/[0.05] transition-colors text-gray-500 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 border border-amber-500/20">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <span className="font-semibold text-lg">Leaderboard</span>
            </div>
          </div>
          <button
            onClick={fetchLeaderboard}
            className="p-2.5 rounded-xl hover:bg-white/[0.05] transition-colors text-gray-500 hover:text-white"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Top Contributors</h1>
            <Sparkles className="w-6 h-6 text-amber-400 animate-float" />
          </div>
          <p className="text-gray-500">Celebrating our most active community members making a difference.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="geist-spinner w-8 h-8" />
          </div>
        ) : error ? (
          <div className="geist-card-glass p-8 text-center max-w-md mx-auto">
            <Trophy className="w-10 h-10 text-gray-600 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={fetchLeaderboard} className="geist-button geist-button-secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => {
              const BadgeIcon = BADGE_ICONS[entry.badge.icon] || User;
              const isTopThree = entry.rank <= 3;
              const rankStyle = RANK_STYLES[entry.rank - 1];

              return (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`geist-card-glass p-5 ${isTopThree ? `ring-2 ${rankStyle.ring}` : ""}`}
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    {/* Rank */}
                    <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg ${
                      isTopThree 
                        ? `bg-gradient-to-br ${rankStyle.bg} text-white ${rankStyle.shadow}` 
                        : "bg-gray-800 text-gray-400"
                    }`}>
                      {entry.rank}
                    </div>

                    {/* Badge */}
                    <div
                      className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border"
                      style={{ 
                        backgroundColor: `${entry.badge.color}15`,
                        borderColor: `${entry.badge.color}30`
                      }}
                    >
                      <BadgeIcon className="w-6 h-6" style={{ color: entry.badge.color }} />
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-white truncate">{entry.userPhone}</p>
                      <p className="text-xs font-medium" style={{ color: entry.badge.color }}>
                        {entry.badge.name}
                      </p>
                    </div>

                    {/* Stats - Desktop */}
                    <div className="hidden md:flex items-center gap-6 text-sm">
                      <div className="text-center min-w-[60px]">
                        <p className="font-bold text-white">{entry.problemsReported}</p>
                        <p className="text-xs text-gray-600">Reports</p>
                      </div>
                      <div className="text-center min-w-[80px]">
                        <p className="font-bold text-white">{entry.verificationsGiven}</p>
                        <p className="text-xs text-gray-600">Verifications</p>
                      </div>
                      <div className="text-center min-w-[70px]">
                        <p className="font-bold text-white">{entry.responsesOffered}</p>
                        <p className="text-xs text-gray-600">Help Offered</p>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="shrink-0 text-right">
                      <p className="stat-card-value text-2xl md:text-3xl">{entry.score}</p>
                      <p className="text-[10px] text-gray-600 uppercase tracking-wider">points</p>
                    </div>
                  </div>

                  {/* Mobile Stats */}
                  <div className="md:hidden grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/[0.06]">
                    <div className="text-center">
                      <p className="font-bold text-white">{entry.problemsReported}</p>
                      <p className="text-[10px] text-gray-600">Reports</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-white">{entry.verificationsGiven}</p>
                      <p className="text-[10px] text-gray-600">Verifications</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-white">{entry.responsesOffered}</p>
                      <p className="text-[10px] text-gray-600">Help Offered</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
