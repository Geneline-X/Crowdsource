"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { Problem } from "@/lib/types";
import { MapView } from "@/app/components/map-view";
import { cn } from "@/lib/utils";

const CATEGORY_MAP: Record<string, { label: string; badge: string; dot: string }> = {
  infrastructure: { label: "Infrastructure", badge: "geist-badge-blue", dot: "geist-status-dot-blue" },
  sanitation: { label: "Sanitation", badge: "geist-badge-green", dot: "geist-status-dot-green" },
  safety: { label: "Safety", badge: "geist-badge-red", dot: "geist-status-dot-red" },
  default: { label: "General", badge: "geist-badge-gray", dot: "geist-status-dot-amber" },
};

function getCategoryConfig(locationSource: string | null) {
  if (!locationSource) return CATEGORY_MAP.default;
  return CATEGORY_MAP[locationSource] || CATEGORY_MAP.default;
}

export default function HomePage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "verified" | "pending">("all");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [previousProblemCount, setPreviousProblemCount] = useState<number>(0);
  const [newProblemDetected, setNewProblemDetected] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; mimeType: string } | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchProblems = useCallback(async () => {
    try {
      const response = await fetch("/api/problems");
      if (!response.ok) {
        throw new Error("Failed to fetch problems");
      }
      const data = await response.json();
      
      // Check if new problems were added
      if (data.length > previousProblemCount && previousProblemCount > 0) {
        setNewProblemDetected(true);
        setTimeout(() => setNewProblemDetected(false), 3000); // Hide notification after 3 seconds
      }
      
      setProblems(data);
      setPreviousProblemCount(data.length);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [previousProblemCount]);

  useEffect(() => {
    // Initial fetch
    fetchProblems();

    // Set up polling for real-time updates
    pollingRef.current = setInterval(() => {
      fetchProblems();
    }, 5000); // Poll every 5 seconds

    // Cleanup on unmount
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [fetchProblems]);

  const handleVote = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/problems/${id}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterPhone: "anonymous" }),
      });

      if (response.ok) {
        // Immediately refresh to get the latest data
        fetchProblems();
      }
    } catch (err) {
      console.error("Failed to upvote problem:", err);
    }
  }, [fetchProblems]);

  const handleSelectProblem = useCallback((id: number) => {
    const problem = problems.find((p) => p.id === id);
    if (problem && problem.latitude && problem.longitude) {
      setSelectedId(id);
    }
  }, [problems]);

  const sorted = [...problems].sort((a, b) => b.upvoteCount - a.upvoteCount);
  
  const filteredProblems = sorted.filter((p) => {
    if (activeFilter === "verified") return p.locationVerified;
    if (activeFilter === "pending") return !p.locationVerified;
    return true;
  });

  const verifiedCount = problems.filter((p) => p.locationVerified).length;
  const pendingCount = problems.filter((p) => !p.locationVerified).length;
  
  const maxVotes = Math.max(...problems.map((p) => p.upvoteCount), 1);
  const totalVotes = problems.reduce((s, p) => s + p.upvoteCount, 0);
  const selectedProblem = selectedId ? problems.find((p) => p.id === selectedId) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="geist-spinner" />
          <span className="geist-text-body">Loading problems</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="geist-card p-8 text-center max-w-md">
          <p className="geist-text-subtitle mb-2">Failed to load</p>
          <p className="geist-text-small">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* New Problem Notification */}
      <AnimatePresence>
        {newProblemDetected && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="font-medium">New problem reported!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-40 bg-[var(--ds-background-100)] border-b border-[var(--ds-gray-300)]">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-[var(--ds-gray-1000)]" />
            <span className="font-semibold">Crowdsource</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="geist-text-small text-[var(--ds-gray-600)]">Live</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="geist-text-small">{problems.length} issues reported</span>
            <span className="geist-text-small text-[var(--ds-gray-500)]">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
            <Link
              href="/weekly-blog"
              className="geist-button geist-button-secondary geist-text-small h-7 px-3"
            >
              Weekly blog
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="geist-text-title mb-2">Community Issues</h1>
          <p className="geist-text-body">
            Problems reported by community members. Vote on issues that matter to you.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Active Issues", value: problems.length },
            { label: "Total Votes", value: totalVotes },
            { label: "With Location", value: problems.filter((p) => p.latitude && p.longitude).length },
          ].map((stat) => (
            <div key={stat.label} className="geist-card p-4">
              <p className="geist-text-label mb-1">{stat.label}</p>
              <p className="geist-text-title">{stat.value}</p>
            </div>
          ))}
        </div>

        <hr className="geist-divider mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1">
                {[
                  { key: "all", label: "All", count: problems.length },
                  { key: "verified", label: "Verified", count: verifiedCount },
                  { key: "pending", label: "Pending", count: pendingCount },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key as typeof activeFilter)}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                      activeFilter === tab.key
                        ? "bg-[var(--ds-gray-1000)] text-[var(--ds-background-100)]"
                        : "text-[var(--ds-gray-700)] hover:text-[var(--ds-gray-900)] hover:bg-[var(--ds-gray-100)]"
                    )}
                  >
                    {tab.label}
                    <span className="ml-1.5 text-xs opacity-60">{tab.count}</span>
                  </button>
                ))}
              </div>
              <p className="geist-text-small">{filteredProblems.length} shown</p>
            </div>

            <div className="geist-card overflow-hidden">
              {filteredProblems.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="geist-text-body">No problems in this category</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredProblems.map((problem, index) => {
                    const category = getCategoryConfig(problem.locationSource);
                    const hasLocation = problem.latitude !== null && problem.longitude !== null;
                    const isSelected = selectedId === problem.id;

                    return (
                      <motion.div
                        key={problem.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        onClick={() => hasLocation && handleSelectProblem(problem.id)}
                        className={cn(
                          "geist-entity",
                          hasLocation && "cursor-pointer",
                          isSelected && "bg-[var(--ds-blue-100)] border-l-2 border-l-[var(--ds-blue-500)]"
                        )}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(problem.id);
                          }}
                          className="geist-vote shrink-0"
                        >
                          <div className="geist-vote-arrow" />
                          <span className="geist-vote-count">{problem.upvoteCount}</span>
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={cn("geist-status-dot", category.dot)} />
                            <h3 className="font-medium truncate">{problem.title}</h3>
                            {hasLocation && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--ds-gray-200)] text-[var(--ds-gray-700)]">
                                MAP
                              </span>
                            )}
                          </div>
                          <p className="geist-text-small line-clamp-2 mb-2">
                            {problem.rawMessage}
                          </p>
                          {problem.images && problem.images.length > 0 && (
                            <div className="mb-2">
                              <div className="flex gap-2 mb-1">
                                {problem.images.slice(0, 3).map((image, idx) => (
                                  <div key={idx} className="relative group">
                                    <img
                                      src={image.url}
                                      alt="Problem image"
                                      className="w-20 h-20 object-cover rounded-lg border-2 border-[var(--ds-gray-200)] cursor-pointer hover:border-[var(--ds-blue-500)] transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImage({ url: image.url, mimeType: image.mimeType });
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                                      <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                      </svg>
                                    </div>
                                  </div>
                                ))}
                                {problem.images.length > 3 && (
                                  <div className="w-20 h-20 bg-[var(--ds-gray-100)] rounded-lg border-2 border-[var(--ds-gray-200)] flex flex-col items-center justify-center text-xs text-[var(--ds-gray-600)]">
                                    <span className="font-semibold">+{problem.images.length - 3}</span>
                                    <span>more</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-[var(--ds-gray-500)]">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                <span>{problem.images.length} image{problem.images.length > 1 ? 's' : ''} attached</span>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-4">
                            <span className="geist-text-mono text-[var(--ds-gray-600)]">
                              {problem.title}
                            </span>
                            {problem.nationalCategory && (
                              <span className="geist-badge geist-badge-blue">
                                {problem.nationalCategory}
                              </span>
                            )}
                            <span className={cn("geist-badge", category.badge)}>
                              {problem.locationVerified ? "Verified" : "Pending"}
                            </span>
                          </div>
                          <div className="geist-progress mt-3">
                            <div
                              className="geist-progress-bar"
                              style={{ width: `${(problem.upvoteCount / maxVotes) * 100}%` }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <p className="geist-text-label">Geographic View</p>
                <button
                  onClick={() => setIsMapFullscreen(true)}
                  className="geist-button geist-button-secondary text-xs h-7 px-2"
                >
                  Expand
                </button>
              </div>
              <div className="geist-card overflow-hidden">
                <MapView
                  problems={problems.filter((p) => p.latitude !== null && p.longitude !== null)}
                  onSelectProblem={(id) => setSelectedId(id)}
                  selectedProblemId={selectedId}
                  centerOnProblem={selectedProblem}
                />
              </div>
              {selectedProblem && (
                <div className="mt-2 p-3 geist-card bg-[var(--ds-blue-100)]">
                  <p className="geist-text-small font-medium text-[var(--ds-blue-700)]">
                    Selected: {selectedProblem.title}
                  </p>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="geist-text-small text-[var(--ds-gray-600)] mt-1 hover:underline"
                  >
                    Clear selection
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Fullscreen Map Modal */}
      <AnimatePresence>
        {isMapFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[var(--ds-background-100)]"
          >
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              {selectedProblem && (
                <div className="geist-card p-3 bg-[var(--ds-blue-100)]">
                  <p className="geist-text-small font-medium">{selectedProblem.title}</p>
                  <p className="geist-text-small text-[var(--ds-gray-600)]">
                    {selectedProblem.upvoteCount} votes
                  </p>
                </div>
              )}
              <button
                onClick={() => setIsMapFullscreen(false)}
                className="geist-button geist-button-primary"
              >
                Close
              </button>
            </div>
            <MapView
              problems={problems.filter((p) => p.latitude !== null && p.longitude !== null)}
              onSelectProblem={(id) => setSelectedId(id)}
              selectedProblemId={selectedId}
              centerOnProblem={selectedProblem}
              fullscreen
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt="Problem image"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <a
                href={selectedImage.url}
                download="problem-image"
                className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
