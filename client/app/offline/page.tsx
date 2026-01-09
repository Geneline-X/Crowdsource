"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WifiOff, RefreshCw, Home, Clock } from "lucide-react";

interface CachedProblem {
  id: number;
  title: string;
  status: string;
  locationText: string | null;
}

export default function OfflinePage() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [cachedProblems, setCachedProblems] = useState<CachedProblem[]>([]);

  useEffect(() => {
    // Try to get cached problems from the cache API
    const loadCachedData = async () => {
      try {
        const cache = await caches.open("api-cache");
        const cachedResponse = await cache.match("/api/problems");
        if (cachedResponse) {
          const data = await cachedResponse.json();
          setCachedProblems(data.slice(0, 5)); // Show first 5 cached problems
        }
      } catch {
        // Cache not available or empty
      }
    };

    loadCachedData();

    // Listen for online status
    const handleOnline = () => {
      window.location.href = "/";
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const response = await fetch("/", { method: "HEAD" });
      if (response.ok) {
        window.location.href = "/";
      }
    } catch {
      // Still offline
    }
    setIsRetrying(false);
  };

  return (
    <div className="min-h-screen bg-[var(--ds-background-100)] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--ds-background-100)] border-b border-[var(--ds-gray-300)]">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-[var(--ds-gray-1000)]" />
            <span className="font-semibold">Crowdsource</span>
            <div className="flex items-center gap-1">
              <WifiOff className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-amber-500">Offline</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="text-center max-w-md">
          {/* Offline illustration */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--ds-gray-200)] flex items-center justify-center">
            <WifiOff className="w-12 h-12 text-[var(--ds-gray-600)]" />
          </div>

          <h1 className="text-2xl font-semibold text-[var(--ds-gray-1000)] mb-2">
            You&apos;re offline
          </h1>
          <p className="text-[var(--ds-gray-900)] mb-6">
            Check your internet connection and try again. Some features may still
            be available from cached data.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--ds-gray-1000)] text-[var(--ds-gray-100)] font-medium rounded-lg hover:bg-[var(--ds-gray-900)] transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`}
              />
              {isRetrying ? "Checking..." : "Try again"}
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--ds-gray-400)] text-[var(--ds-gray-1000)] font-medium rounded-lg hover:bg-[var(--ds-gray-200)] transition-colors"
            >
              <Home className="w-4 h-4" />
              Go home
            </Link>
          </div>
        </div>

        {/* Cached problems section */}
        {cachedProblems.length > 0 && (
          <div className="mt-12 w-full max-w-lg">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-[var(--ds-gray-600)]" />
              <h2 className="text-sm font-medium text-[var(--ds-gray-900)]">
                Recently viewed issues
              </h2>
            </div>
            <div className="space-y-2">
              {cachedProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="p-3 bg-[var(--ds-gray-100)] border border-[var(--ds-gray-300)] rounded-lg"
                >
                  <h3 className="font-medium text-sm text-[var(--ds-gray-1000)] line-clamp-1">
                    {problem.title}
                  </h3>
                  {problem.locationText && (
                    <p className="text-xs text-[var(--ds-gray-700)] mt-1">
                      {problem.locationText}
                    </p>
                  )}
                  <span
                    className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                      problem.status === "RESOLVED"
                        ? "bg-green-500/10 text-green-400"
                        : problem.status === "IN_PROGRESS"
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {problem.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-[var(--ds-gray-600)]">
        <p>Content will sync when you&apos;re back online</p>
      </footer>
    </div>
  );
}
