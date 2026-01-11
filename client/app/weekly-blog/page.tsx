"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, ArrowLeft, Trophy, Flame, TrendingUp } from "lucide-react";

import { Problem } from "@/lib/types";
import { cn } from "@/lib/utils";

function getStartOfCurrentWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  const start = new Date(now);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getWeekOptions(count = 12) {
  const options = [];
  const startOfCurrentWeek = getStartOfCurrentWeek();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(startOfCurrentWeek);
    date.setDate(date.getDate() - (i * 7));
    options.push(date);
  }
  return options;
}

function formatWeekRange(startDate: Date) {
  const end = new Date(startDate);
  end.setDate(end.getDate() + 6);
  return `${startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
}

const RANK_COLORS = [
  { border: "border-amber-500/50", bg: "from-amber-500/10 to-transparent", badge: "bg-amber-500", icon: Trophy },
  { border: "border-gray-400/50", bg: "from-gray-400/10 to-transparent", badge: "bg-gray-400", icon: TrendingUp },
  { border: "border-amber-700/50", bg: "from-amber-700/10 to-transparent", badge: "bg-amber-700", icon: Flame },
];

export default function WeeklyBlogPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'weekly' | 'overall'>('weekly');
  const [selectedDate, setSelectedDate] = useState<Date>(getStartOfCurrentWeek());

  useEffect(() => {
    async function fetchProblems() {
      try {
        const response = await fetch("/api/problems");
        if (!response.ok) {
          throw new Error("Failed to fetch problems");
        }
        const data = await response.json();
        setProblems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProblems();
  }, []);

  const weekOptions = getWeekOptions();

  const filteredProblems = problems.filter((p) => {
    if (viewMode === 'overall') return true;
    
    const createdAt = new Date((p as any).createdAt as any);
    const endOfWeek = new Date(selectedDate);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    
    return createdAt >= selectedDate && createdAt < endOfWeek;
  });

  const sortedProblems = [...filteredProblems].sort((a, b) => b.upvoteCount - a.upvoteCount);
  
  const topThree = sortedProblems.slice(0, 3);
  const totalVotes = sortedProblems.reduce((sum, p) => sum + p.upvoteCount, 0);

  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    if (newDate <= getStartOfCurrentWeek()) {
      setSelectedDate(newDate);
    }
  };

  const isCurrentWeek = selectedDate.getTime() === getStartOfCurrentWeek().getTime();

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
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20">
                <Flame className="w-5 h-5 text-violet-400" />
              </div>
              <span className="font-semibold text-lg">
                {viewMode === 'weekly' ? 'Weekly Leaderboard' : 'All-Time Ranking'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Title & Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {viewMode === 'weekly' ? 'Weekly Leaderboard' : 'Overall Pressing Problems'}
            </h1>
            <p className="text-gray-500">
              {viewMode === 'weekly' 
                ? "Ranking of the most upvoted community problems for the selected week."
                : "All-time ranking of the most pressing community problems."}
            </p>
          </div>
        </div>

        {/* View Toggle & Week Selector */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-10 pb-6 border-b border-white/[0.06]">
          {/* View Toggle */}
          <div className="flex p-1 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setViewMode('weekly')}
              className={cn(
                "px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                viewMode === 'weekly' 
                  ? "bg-white text-black shadow-sm" 
                  : "text-gray-500 hover:text-white"
              )}
            >
              Weekly View
            </button>
            <button
              onClick={() => setViewMode('overall')}
              className={cn(
                "px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                viewMode === 'overall' 
                  ? "bg-white text-black shadow-sm" 
                  : "text-gray-500 hover:text-white"
              )}
            >
              Overall View
            </button>
          </div>

          {/* Week Selector */}
          {viewMode === 'weekly' && (
            <div className="flex items-center gap-2 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06]">
              <button 
                onClick={handlePrevWeek}
                className="p-2 rounded-lg hover:bg-white/[0.05] text-gray-500 hover:text-white transition-colors disabled:opacity-40"
                disabled={selectedDate.getTime() <= weekOptions[weekOptions.length - 1].getTime()}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 px-4 py-2 min-w-[160px] justify-center">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-white tabular-nums">
                  {formatWeekRange(selectedDate)}
                </span>
              </div>
              <button 
                onClick={handleNextWeek}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isCurrentWeek 
                    ? "text-gray-700 cursor-not-allowed" 
                    : "hover:bg-white/[0.05] text-gray-500 hover:text-white"
                )}
                disabled={isCurrentWeek}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 justify-center py-20">
            <div className="geist-spinner" />
            <span className="text-gray-500">Loading leaderboard...</span>
          </div>
        ) : error ? (
          <div className="geist-card-glass p-8 text-center max-w-md mx-auto">
            <p className="text-red-400 mb-2">Failed to load leaderboard</p>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        ) : sortedProblems.length === 0 ? (
          <div className="geist-card-glass p-8 text-center max-w-md mx-auto">
            <Trophy className="w-10 h-10 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {viewMode === 'weekly' 
                ? "No problems reported this week yet."
                : "No problems reported yet."}
            </p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { label: viewMode === 'weekly' ? 'Weekly Problems' : 'Total Problems', value: sortedProblems.length, sub: viewMode === 'weekly' ? 'Reported this week' : 'Reported all time' },
                { label: viewMode === 'weekly' ? 'Weekly Votes' : 'Total Votes', value: totalVotes, sub: viewMode === 'weekly' ? 'Total upvotes this week' : 'Total upvotes all time' },
                { label: 'Top Positions', value: 3, sub: 'Highlighted problems' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="geist-card-glass p-5"
                >
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{stat.label}</p>
                  <p className="stat-card-value text-3xl">{stat.value}</p>
                  <p className="text-xs text-gray-600 mt-1">{stat.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Top 3 Problems */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {topThree.map((problem, index) => {
                const rank = index + 1;
                const location = (problem as any).locationText || "Unspecified location";
                const rawMessage: string = (problem as any).rawMessage || "";
                const preview = rawMessage.slice(0, 100).trimEnd() + (rawMessage.length > 100 ? "..." : "");
                const style = RANK_COLORS[index];
                const RankIcon = style.icon;

                return (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={cn(
                      "geist-card-glass p-6 border-2",
                      style.border
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        style.badge
                      )}>
                        <span className="text-lg font-bold text-white">{rank}</span>
                      </div>
                      <div className="text-right">
                        <p className="stat-card-value text-2xl">{problem.upvoteCount}</p>
                        <p className="text-[10px] text-gray-600 uppercase">votes</p>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-white mb-1 line-clamp-1">{problem.title}</h3>
                    <p className="text-xs text-gray-600 mb-3 truncate">{location}</p>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{preview}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{new Date((problem as any).createdAt as any).toLocaleDateString()}</span>
                      <span className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]">
                        ID {problem.id}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Full Ranking Table */}
            <div className="geist-card-glass overflow-hidden">
              <div className="p-5 border-b border-white/[0.06]">
                <h2 className="font-semibold text-white">Complete Ranking</h2>
                <p className="text-sm text-gray-600">
                  {viewMode === 'weekly' 
                    ? "All problems reported this week, ordered by upvotes."
                    : "All problems reported, ordered by upvotes."}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-white/[0.06] text-gray-500">
                    <tr>
                      <th className="text-left py-4 px-5 font-medium">Rank</th>
                      <th className="text-left py-4 pr-5 font-medium">Problem</th>
                      <th className="text-left py-4 pr-5 font-medium hidden md:table-cell">Location</th>
                      <th className="text-left py-4 pr-5 font-medium hidden lg:table-cell">Reported</th>
                      <th className="text-right py-4 pr-5 font-medium">Votes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProblems.map((problem, index) => {
                      const rank = index + 1;
                      const location = (problem as any).locationText || "Unspecified";
                      return (
                        <tr
                          key={problem.id}
                          className={cn(
                            "border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.02]",
                            index % 2 === 1 && "bg-white/[0.01]"
                          )}
                        >
                          <td className="py-4 px-5 text-gray-500">{rank}</td>
                          <td className="py-4 pr-5">
                            <p className="font-medium text-white truncate max-w-[200px] lg:max-w-xs">{problem.title}</p>
                            <p className="text-xs text-gray-600">ID {problem.id}</p>
                          </td>
                          <td className="py-4 pr-5 text-gray-500 truncate max-w-[150px] hidden md:table-cell">{location}</td>
                          <td className="py-4 pr-5 text-gray-500 hidden lg:table-cell">
                            {new Date((problem as any).createdAt as any).toLocaleDateString()}
                          </td>
                          <td className="py-4 pr-5 text-right font-bold text-white">{problem.upvoteCount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
