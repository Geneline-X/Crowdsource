"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

function getWeeklyProblems(problems: Problem[]) {
  const startOfWeek = getStartOfCurrentWeek();

  const weeklyProblems = problems.filter((p) => {
    const createdAt = new Date((p as any).createdAt as any);
    return createdAt >= startOfWeek;
  });

  return [...weeklyProblems].sort((a, b) => b.upvoteCount - a.upvoteCount);
}

export default function WeeklyBlogPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const weeklyProblems = getWeeklyProblems(problems);
  const weeklyTopThree = weeklyProblems.slice(0, 3);
  const weeklyVotes = weeklyProblems.reduce((sum, p) => sum + p.upvoteCount, 0);

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="geist-text-title mb-1">Weekly Leaderboard</h1>
          <p className="geist-text-body text-[var(--ds-gray-800)]">
            Ranking of this week's most upvoted community problems.
          </p>
        </div>
        <Link href="/" className="geist-button geist-button-secondary text-sm">
          Back to main view
        </Link>
      </header>

      {isLoading ? (
        <div className="flex items-center gap-3">
          <div className="geist-spinner" />
          <span className="geist-text-body">Loading leaderboard…</span>
        </div>
      ) : error ? (
        <div className="geist-card p-4">
          <p className="geist-text-subtitle mb-1">Failed to load leaderboard</p>
          <p className="geist-text-small">{error}</p>
        </div>
      ) : weeklyProblems.length === 0 ? (
        <div className="geist-card p-4">
          <p className="geist-text-small">
            No problems have enough activity this week yet. Check back later for the weekly leaderboard.
          </p>
        </div>
      ) : (
        <>
          <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="geist-card p-4 flex flex-col justify-between bg-[var(--ds-gray-100)]">
              <p className="geist-text-label mb-1">Weekly Problems</p>
              <p className="geist-text-title">{weeklyProblems.length}</p>
              <p className="geist-text-small text-[var(--ds-gray-700)] mt-1">Reported this week</p>
            </div>
            <div className="geist-card p-4 flex flex-col justify-between bg-[var(--ds-gray-100)]">
              <p className="geist-text-label mb-1">Weekly Votes</p>
              <p className="geist-text-title">{weeklyVotes}</p>
              <p className="geist-text-small text-[var(--ds-gray-700)] mt-1">Total upvotes on weekly problems</p>
            </div>
            <div className="geist-card p-4 flex flex-col justify-between bg-[var(--ds-gray-100)]">
              <p className="geist-text-label mb-1">Top Positions</p>
              <p className="geist-text-title">3</p>
              <p className="geist-text-small text-[var(--ds-gray-700)] mt-1">
                Only the top three problems are highlighted this week.
              </p>
            </div>
          </section>

          <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {weeklyTopThree.map((problem, index) => {
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
                  className={`geist-card relative flex flex-col justify-between p-4 border-2 ${borderColor}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--ds-gray-900)] text-xs text-[var(--ds-background-100)]">
                          {rank}
                        </span>
                        <span className="geist-text-subtitle truncate max-w-xs">{problem.title}</span>
                      </div>
                      <p className="geist-text-small text-[var(--ds-gray-700)] truncate max-w-xs">{location}</p>
                    </div>
                    <div className="text-right">
                      <p className="geist-text-label text-[var(--ds-gray-700)]">Votes</p>
                      <p className="geist-text-title">{problem.upvoteCount}</p>
                    </div>
                  </div>
                  <p className="geist-text-small text-[var(--ds-gray-800)] mb-3 line-clamp-3">{preview}</p>
                  <div className="flex justify-between items-center text-xs text-[var(--ds-gray-700)]">
                    <span>
                      Reported on {new Date((problem as any).createdAt as any).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[var(--ds-gray-200)]">
                      ID {problem.id}
                    </span>
                  </div>
                </div>
              );
            })}
          </section>

          <section className="geist-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="geist-text-subtitle">Global Ranking</h2>
              <p className="geist-text-small text-[var(--ds-gray-700)]">
                All problems reported this week, ordered by upvotes.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-[var(--ds-gray-300)] text-[var(--ds-gray-700)]">
                  <tr>
                    <th className="py-2 pr-4">Rank</th>
                    <th className="py-2 pr-4">Problem</th>
                    <th className="py-2 pr-4">Location</th>
                    <th className="py-2 pr-4">Reported</th>
                    <th className="py-2 pr-4 text-right">Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyProblems.map((problem, index) => {
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
                        <td className="py-2 pr-4 text-[var(--ds-gray-800)]">{rank}</td>
                        <td className="py-2 pr-4">
                          <div className="flex flex-col">
                            <span className="geist-text-small font-medium truncate max-w-xs">
                              {problem.title}
                            </span>
                            <span className="text-[11px] text-[var(--ds-gray-600)]">ID {problem.id}</span>
                          </div>
                        </td>
                        <td className="py-2 pr-4 text-[var(--ds-gray-800)] truncate max-w-xs">{location}</td>
                        <td className="py-2 pr-4 text-[var(--ds-gray-800)]">
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
