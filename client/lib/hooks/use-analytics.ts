"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";

interface AnalyticsData {
  summary: {
    totalProblems: number;
    resolvedProblems: number;
    pendingProblems: number;
    inProgressProblems: number;
    totalUpvotes: number;
    resolutionRate: number;
    trendPercentage: number;
  };
  problemsOverTime: { date: string; count: number; resolved: number }[];
  categoryBreakdown: { name: string; value: number }[];
  statusDistribution: { name: string; value: number }[];
  topReporters: { phone: string; reports: number; upvotes: number }[];
  locationBreakdown: { name: string; value: number }[];
}

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

async function fetchAnalytics(days: number): Promise<AnalyticsData> {
  const response = await fetch(`${SERVER_URL}/api/ministry/analytics?days=${days}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch analytics: ${response.status}`);
  }
  
  const result = await response.json();
  if (!result.success) {
    throw new Error("Failed to load analytics data");
  }
  
  return result.data;
}

export function useAnalytics(days: number) {
  return useQuery({
    queryKey: queryKeys.analytics.stats(), // Use structured query key if possible, or ["analytics", days]
    queryFn: () => fetchAnalytics(days),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
