"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Crown,
  Star,
  Award,
  Shield,
  User,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useLeaderboard } from "@/lib/hooks/use-leaderboard";
import { LeaderboardSkeleton } from "@/app/components/ui/skeleton";

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
  const { data: leaderboard, isLoading, error, refetch } = useLeaderboard();

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F0F1E8]">
      {/* Header */}
      <header className="shrink-0 bg-white border-b border-[#E8E6E1] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <span className="font-semibold text-lg text-[#262626]">Leaderboard</span>
          </div>
          <button
            onClick={() => refetch()}
            className="p-2.5 rounded-lg hover:bg-[#E8E6E1] transition-colors text-[#525252]"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        {/* Title */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-[#262626]">Top Contributors</h1>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-[#525252]">Celebrating our most active community members making a difference.</p>
        </div>

        {isLoading ? (
          <LeaderboardSkeleton />
        ) : error ? (
          <div className="bg-white rounded-xl border border-[#E8E6E1] p-8 text-center max-w-md mx-auto">
            <Trophy className="w-10 h-10 text-[#737373] mx-auto mb-4" />
            <p className="text-red-500 mb-4">{(error as Error).message || "Failed to load leaderboard"}</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-[#2D5A47] text-white rounded-lg hover:bg-[#235242] transition-colors">
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard?.map((entry, index) => {
              const BadgeIcon = BADGE_ICONS[entry.badge.icon] || User;
              const isTopThree = entry.rank <= 3;
              const rankStyle = RANK_STYLES[entry.rank - 1];

              return (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-xl border border-[#E8E6E1] p-5 ${isTopThree ? `ring-2 ${rankStyle.ring}` : ""}`}
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    {/* Rank */}
                    <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg ${
                      isTopThree 
                        ? `bg-gradient-to-br ${rankStyle.bg} text-white ${rankStyle.shadow}` 
                        : "bg-[#F5F3EE] text-[#525252]"
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
                      <p className="font-mono text-sm text-[#262626] truncate">{entry.userPhone}</p>
                      <p className="text-xs font-medium" style={{ color: entry.badge.color }}>
                        {entry.badge.name}
                      </p>
                    </div>

                    {/* Stats - Desktop */}
                    <div className="hidden md:flex items-center gap-6 text-sm">
                      <div className="text-center min-w-[60px]">
                        <p className="font-bold text-[#262626]">{entry.problemsReported}</p>
                        <p className="text-xs text-[#737373]">Reports</p>
                      </div>
                      <div className="text-center min-w-[80px]">
                        <p className="font-bold text-[#262626]">{entry.verificationsGiven}</p>
                        <p className="text-xs text-[#737373]">Verifications</p>
                      </div>
                      <div className="text-center min-w-[70px]">
                        <p className="font-bold text-[#262626]">{entry.responsesOffered}</p>
                        <p className="text-xs text-[#737373]">Help Offered</p>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="shrink-0 text-right">
                      <p className="text-2xl md:text-3xl font-bold text-[#4A7766]">{entry.score}</p>
                      <p className="text-[10px] text-[#737373] uppercase tracking-wider">points</p>
                    </div>
                  </div>

                  {/* Mobile Stats */}
                  <div className="md:hidden grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#E8E6E1]">
                    <div className="text-center">
                      <p className="font-bold text-[#262626]">{entry.problemsReported}</p>
                      <p className="text-[10px] text-[#737373]">Reports</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-[#262626]">{entry.verificationsGiven}</p>
                      <p className="text-[10px] text-[#737373]">Verifications</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-[#262626]">{entry.responsesOffered}</p>
                      <p className="text-[10px] text-[#737373]">Help Offered</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

