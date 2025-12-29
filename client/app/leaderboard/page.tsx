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

const BADGE_ICONS: Record<string, any> = {
  trophy: Trophy,
  crown: Crown,
  star: Star,
  award: Award,
  shield: Shield,
  user: User,
};

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
      <header className="sticky top-0 z-40 bg-[var(--ds-background-100)] border-b border-[var(--ds-gray-300)]">
        <div className="max-w-screen-xl mx-auto px-3 md:px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-md hover:bg-[var(--ds-gray-200)] transition-colors">
              <ArrowLeft className="w-4 h-4 text-[var(--ds-gray-700)]" />
            </Link>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[var(--ds-amber-500)]" />
              <span className="font-semibold text-sm md:text-base">Leaderboard</span>
            </div>
          </div>
          <button
            onClick={fetchLeaderboard}
            className="geist-button geist-button-secondary h-8 px-2"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">Top Contributors</h1>
          <p className="geist-text-body text-sm md:text-base">
            Celebrating our most active community members making a difference.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="geist-spinner w-6 h-6" />
          </div>
        ) : error ? (
          <div className="geist-card p-6 border-[var(--ds-red-400)] text-center">
            <p className="text-[var(--ds-red-600)]">{error}</p>
            <button onClick={fetchLeaderboard} className="geist-button geist-button-secondary mt-4">
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => {
              const BadgeIcon = BADGE_ICONS[entry.badge.icon] || User;
              const isTopThree = entry.rank <= 3;

              return (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`geist-card p-4 ${isTopThree ? "border-2" : ""} ${
                    entry.rank === 1
                      ? "border-[var(--ds-amber-500)] bg-gradient-to-r from-[var(--ds-amber-100)] to-transparent"
                      : entry.rank === 2
                      ? "border-[var(--ds-gray-500)]"
                      : entry.rank === 3
                      ? "border-[var(--ds-amber-700)]"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* Rank */}
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      entry.rank === 1
                        ? "bg-[var(--ds-amber-500)] text-black"
                        : entry.rank === 2
                        ? "bg-[var(--ds-gray-600)] text-white"
                        : entry.rank === 3
                        ? "bg-[var(--ds-amber-700)] text-white"
                        : "bg-[var(--ds-gray-300)] text-[var(--ds-gray-900)]"
                    }`}>
                      {entry.rank}
                    </div>

                    {/* Badge */}
                    <div className="shrink-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${entry.badge.color}20` }}
                      >
                        <BadgeIcon className="w-5 h-5" style={{ color: entry.badge.color }} />
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <p className="geist-text-mono text-sm truncate">{entry.userPhone}</p>
                      <p className="text-xs" style={{ color: entry.badge.color }}>
                        {entry.badge.name}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:flex items-center gap-4 text-xs">
                      <div className="text-center">
                        <p className="font-bold">{entry.problemsReported}</p>
                        <p className="text-[var(--ds-gray-600)]">Reports</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold">{entry.verificationsGiven}</p>
                        <p className="text-[var(--ds-gray-600)]">Verifications</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold">{entry.responsesOffered}</p>
                        <p className="text-[var(--ds-gray-600)]">Help Offered</p>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="shrink-0 text-right">
                      <p className="text-lg md:text-xl font-bold">{entry.score}</p>
                      <p className="text-[10px] text-[var(--ds-gray-600)]">points</p>
                    </div>
                  </div>

                  {/* Mobile Stats */}
                  <div className="md:hidden grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[var(--ds-gray-300)]">
                    <div className="text-center">
                      <p className="font-bold text-sm">{entry.problemsReported}</p>
                      <p className="text-[10px] text-[var(--ds-gray-600)]">Reports</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-sm">{entry.verificationsGiven}</p>
                      <p className="text-[10px] text-[var(--ds-gray-600)]">Verifications</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-sm">{entry.responsesOffered}</p>
                      <p className="text-[10px] text-[var(--ds-gray-600)]">Help Offered</p>
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
