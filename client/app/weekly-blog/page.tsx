"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

import { Problem } from "@/lib/types";

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
    <main className="max-w-screen-xl mx-auto px-3 md:px-4 py-4 md:py-8">
      <header className="mb-4 md:mb-8 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-1">
              {viewMode === 'weekly' ? 'Weekly Leaderboard' : 'Overall Pressing Problems'}
            </h1>
            <p className="geist-text-body text-sm md:text-base text-[var(--ds-gray-800)]">
              {viewMode === 'weekly' 
                ? "Ranking of the most upvoted community problems for the selected week."
                : "All-time ranking of the most pressing community problems."}
            </p>
          </div>
          <Link href="/" className="geist-button geist-button-secondary text-sm w-full sm:w-auto text-center">
            Back to main view
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-[var(--ds-gray-200)] pb-4">
            <div className="flex bg-[var(--ds-gray-100)] p-1 rounded-lg">
                <button
                    onClick={() => setViewMode('weekly')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        viewMode === 'weekly' 
                        ? 'bg-white shadow-sm text-black' 
                        : 'text-[var(--ds-gray-600)] hover:text-[var(--ds-gray-900)]'
                    }`}
                >
                    Weekly View
                </button>
                <button
                    onClick={() => setViewMode('overall')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        viewMode === 'overall' 
                        ? 'bg-white shadow-sm text-black' 
                        : 'text-[var(--ds-gray-600)] hover:text-[var(--ds-gray-900)]'
                    }`}
                >
                    Overall View
                </button>
            </div>

            {viewMode === 'weekly' && (
                <div className="flex items-center gap-2 bg-[var(--ds-gray-100)] p-1 rounded-lg">
                    <button 
                        onClick={handlePrevWeek}
                        className="p-1.5 hover:bg-white rounded-md text-gray-600 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={selectedDate.getTime() <= weekOptions[weekOptions.length - 1].getTime()}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1 min-w-[140px] justify-center bg-gray-900 rounded-md mx-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium tabular-nums text-white">
                            {formatWeekRange(selectedDate)}
                        </span>
                    </div>
                    <button 
                        onClick={handleNextWeek}
                        className={`p-1.5 rounded-md transition-colors ${
                            isCurrentWeek 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'hover:bg-white text-gray-600 hover:text-black'
                        }`}
                        disabled={isCurrentWeek}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center gap-3">
          <div className="geist-spinner" />
          <span className="geist-text-body text-sm md:text-base">Loading leaderboard…</span>
        </div>
      ) : error ? (
        <div className="geist-card p-3 md:p-4">
          <p className="geist-text-subtitle mb-1 text-base md:text-lg">Failed to load leaderboard</p>
          <p className="geist-text-small text-xs md:text-sm">{error}</p>
        </div>
      ) : sortedProblems.length === 0 ? (
        <div className="geist-card p-3 md:p-4">
          <p className="geist-text-small text-xs md:text-sm">
            {viewMode === 'weekly' 
              ? "No problems have enough activity this week yet. Check back later for the weekly leaderboard."
              : "No problems reported yet."}
          </p>
        </div>
      ) : (
        <>
          <section className="mb-4 md:mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="geist-card p-3 md:p-4 flex flex-col justify-between bg-[var(--ds-gray-100)]">
              <p className="geist-text-label mb-1 text-xs md:text-sm">{viewMode === 'weekly' ? 'Weekly Problems' : 'Total Problems'}</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-semibold">{sortedProblems.length}</p>
              <p className="geist-text-small text-xs md:text-sm text-[var(--ds-gray-700)] mt-1">
                {viewMode === 'weekly' ? 'Reported this week' : 'Reported all time'}
              </p>
            </div>
            <div className="geist-card p-3 md:p-4 flex flex-col justify-between bg-[var(--ds-gray-100)]">
              <p className="geist-text-label mb-1 text-xs md:text-sm">{viewMode === 'weekly' ? 'Weekly Votes' : 'Total Votes'}</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-semibold">{totalVotes}</p>
              <p className="geist-text-small text-xs md:text-sm text-[var(--ds-gray-700)] mt-1">
                {viewMode === 'weekly' ? 'Total upvotes on weekly problems' : 'Total upvotes across all problems'}
              </p>
            </div>
            <div className="geist-card p-3 md:p-4 flex flex-col justify-between bg-[var(--ds-gray-100)]">
              <p className="geist-text-label mb-1 text-xs md:text-sm">Top Positions</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-semibold">3</p>
              <p className="geist-text-small text-xs md:text-sm text-[var(--ds-gray-700)] mt-1">
                Only the top three problems are highlighted.
              </p>
            </div>
          </section>

          <section className="mb-6 md:mb-10 grid grid-cols-1 gap-3 md:gap-4 md:grid-cols-3">
            {topThree.map((problem, index) => {
              const rank = index + 1;
              const location = (problem as any).locationText || "Unspecified location";
              const rawMessage: string = (problem as any).rawMessage || "";
              const preview =
                rawMessage.slice(0, 120).trimEnd() + (rawMessage && rawMessage.length > 120 ? "..." : "");

              const borderColor =
                rank === 1
                  ? "border-yellow-400"
                  : rank === 2
                  ? "border-gray-300"
                  : "border-amber-600";

              return (
                <div
                  key={problem.id}
                  className={`geist-card relative flex flex-col justify-between p-3 md:p-4 border-2 ${borderColor}`}
                >
                  <div className="flex items-start justify-between mb-2 md:mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                        <span className="inline-flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-[var(--ds-gray-900)] text-[10px] md:text-xs text-[var(--ds-background-100)] shrink-0">
                          {rank}
                        </span>
                        <span className="text-sm md:text-base font-medium truncate">{problem.title}</span>
                      </div>
                      <p className="geist-text-small text-xs md:text-sm text-[var(--ds-gray-700)] truncate">{location}</p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className="geist-text-label text-[10px] md:text-xs text-[var(--ds-gray-700)]">Votes</p>
                      <p className="text-lg md:text-xl lg:text-2xl font-semibold">{problem.upvoteCount}</p>
                    </div>
                  </div>
                  <p className="geist-text-small text-xs md:text-sm text-[var(--ds-gray-800)] mb-2 md:mb-3 line-clamp-3">{preview}</p>
                  <div className="flex justify-between items-center text-[10px] md:text-xs text-[var(--ds-gray-700)] gap-2">
                    <span className="truncate">
                      Reported on {new Date((problem as any).createdAt as any).toLocaleDateString()}
                    </span>
                    <span className="px-1.5 md:px-2 py-0.5 rounded-full bg-[var(--ds-gray-200)] whitespace-nowrap">
                      ID {problem.id}
                    </span>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="geist-card p-3 md:p-4">
            <div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h2 className="text-base md:text-lg font-medium">Ranking</h2>
              <p className="geist-text-small text-xs md:text-sm text-[var(--ds-gray-700)]">
                {viewMode === 'weekly' 
                  ? "All problems reported this week, ordered by upvotes."
                  : "All problems reported, ordered by upvotes."}
              </p>
            </div>
            <div className="overflow-x-auto -mx-3 md:mx-0">
              <table className="min-w-full text-left text-xs md:text-sm">
                <thead className="border-b border-[var(--ds-gray-300)] text-[var(--ds-gray-700)]">
                  <tr>
                    <th className="py-2 px-3 md:px-0 md:pr-4">Rank</th>
                    <th className="py-2 pr-4">Problem</th>
                    <th className="py-2 pr-4 hidden md:table-cell">Location</th>
                    <th className="py-2 pr-4 hidden lg:table-cell">Reported</th>
                    <th className="py-2 pr-4 text-right">Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProblems.map((problem, index) => {
                    const rank = index + 1;
                    const location = (problem as any).locationText || "Unspecified location";
                    return (
                      <tr
                        key={problem.id}
                        className={
                          index % 2 === 0
                            ? "border-b border-[var(--ds-gray-200)]"
                            : "border-b border-[var(--ds-gray-200)] bg-[var(--ds-gray-100)]"
                        }
                      >
                        <td className="py-2 px-3 md:px-0 md:pr-4 text-[var(--ds-gray-800)]">{rank}</td>
                        <td className="py-2 pr-4">
                          <div className="flex flex-col">
                            <span className="text-xs md:text-sm font-medium truncate max-w-[150px] md:max-w-xs">
                              {problem.title}
                            </span>
                            <span className="text-[10px] md:text-[11px] text-[var(--ds-gray-600)]">ID {problem.id}</span>
                          </div>
                        </td>
                        <td className="py-2 pr-4 text-[var(--ds-gray-800)] truncate max-w-xs hidden md:table-cell">{location}</td>
                        <td className="py-2 pr-4 text-[var(--ds-gray-800)] hidden lg:table-cell">
                          {new Date((problem as any).createdAt as any).toLocaleDateString()}
                        </td>
                        <td className="py-2 pr-4 text-right text-[var(--ds-gray-900)] font-semibold">
                          {problem.upvoteCount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
