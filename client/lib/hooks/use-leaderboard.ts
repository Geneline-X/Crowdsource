"use client";

import { useQuery } from "@tanstack/react-query";

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

interface LeaderboardResponse {
  success: boolean;
  leaderboard: LeaderboardEntry[];
}

async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await fetch("/api/leaderboard");
  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard");
  }
  const data: LeaderboardResponse = await response.json();
  if (!data.success) {
    throw new Error("Failed to load leaderboard data");
  }
  return data.leaderboard;
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
    staleTime: 1000 * 60 * 5, // 5 minutes (leaderboard doesn't change too often)
  });
}
