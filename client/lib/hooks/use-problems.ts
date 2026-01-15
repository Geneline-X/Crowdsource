"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys, getQueryClient } from "@/lib/query-client";
import { Problem } from "@/lib/types";
import { useAppStore } from "@/lib/stores/app-store";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

// Fetch all problems
async function fetchProblems(): Promise<Problem[]> {
  const response = await fetch("/api/problems");
  if (!response.ok) {
    throw new Error("Failed to fetch problems");
  }
  return response.json();
}

// Upvote a problem
async function upvoteProblem({ id, voterPhone }: { id: number; voterPhone: string }) {
  const response = await fetch(`/api/problems/${id}/upvote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voterPhone }),
  });
  
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("ALREADY_VOTED");
    }
    throw new Error("Failed to upvote");
  }
  
  return response.json();
}

// Create a new problem
async function createProblem(data: {
  title: string;
  description: string;
  locationText: string;
  category: string;
  latitude?: number;
  longitude?: number;
}) {
  const response = await fetch("/api/problems", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error("Failed to create problem");
  }
  
  return response.json();
}

// Fetch heatmap data
async function fetchHeatmap() {
  const response = await fetch(`${SERVER_URL}/api/geo/heatmap`);
  if (!response.ok) {
    throw new Error("Failed to fetch heatmap");
  }
  const result = await response.json();
  return result.success ? result.data : [];
}

/**
 * Hook for fetching all problems with automatic polling
 */
export function useProblems(options?: { pollingInterval?: number }) {
  return useQuery({
    queryKey: queryKeys.problems.list(),
    queryFn: fetchProblems,
    refetchInterval: options?.pollingInterval ?? 5000, // Default 5 second polling
    refetchIntervalInBackground: false, // Don't poll when tab is hidden
  });
}

/**
 * Hook for upvoting with optimistic updates
 */
export function useUpvote() {
  const queryClient = useQueryClient();
  const addVotedProblem = useAppStore((s) => s.addVotedProblem);

  return useMutation({
    mutationFn: upvoteProblem,
    
    // Optimistic update - instant feedback!
    onMutate: async ({ id }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.problems.list() });

      // Snapshot the previous value
      const previousProblems = queryClient.getQueryData<Problem[]>(queryKeys.problems.list());

      // Optimistically update
      queryClient.setQueryData<Problem[]>(queryKeys.problems.list(), (old) => {
        if (!old) return old;
        return old.map((p) =>
          p.id === id ? { ...p, upvoteCount: p.upvoteCount + 1 } : p
        );
      });

      // Mark as voted locally
      addVotedProblem(id);

      // Return context with snapshot
      return { previousProblems };
    },

    // Rollback on error
    onError: (err, { id }, context) => {
      if (context?.previousProblems) {
        queryClient.setQueryData(queryKeys.problems.list(), context.previousProblems);
      }
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.problems.list() });
    },
  });
}

/**
 * Hook for creating new problems with optimistic updates
 */
export function useCreateProblem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProblem,
    
    // Optimistic update - show new problem immediately
    onMutate: async (newProblemData) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.problems.list() });

      const previousProblems = queryClient.getQueryData<Problem[]>(queryKeys.problems.list());

      // Create optimistic problem
      const optimisticProblem: Problem = {
        id: Date.now(), // Temporary ID
        reporterPhone: "",
        title: newProblemData.title,
        rawMessage: newProblemData.description,
        locationText: newProblemData.locationText,
        latitude: newProblemData.latitude ?? null,
        longitude: newProblemData.longitude ?? null,
        locationSource: "manual",
        locationVerified: false,
        nationalCategory: newProblemData.category,
        recommendedOffice: null,
        status: "OPEN",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvoteCount: 0,
        verificationCount: 0,
        images: [],
        verifications: [],
        aiCategory: null,
        aiCategoryConfidence: null,
        severityScore: undefined,
        severityLastUpdated: null,
        resolutionProof: [],
        resolvedAt: null,
        resolvedBy: null,
        resolutionNotes: null,
        averageRating: null,
        ratingCount: 0,
      };

      queryClient.setQueryData<Problem[]>(queryKeys.problems.list(), (old) => {
        return old ? [optimisticProblem, ...old] : [optimisticProblem];
      });

      return { previousProblems };
    },

    onError: (err, variables, context) => {
      if (context?.previousProblems) {
        queryClient.setQueryData(queryKeys.problems.list(), context.previousProblems);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.problems.list() });
    },
  });
}

/**
 * Hook for fetching heatmap data
 */
export function useHeatmap(enabled = true) {
  return useQuery({
    queryKey: queryKeys.problems.heatmap(),
    queryFn: fetchHeatmap,
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes - heatmap data changes less frequently
  });
}

/**
 * Prefetch problems - call on hover or route transition
 */
export function prefetchProblems() {
  const queryClient = getQueryClient();
  return queryClient.prefetchQuery({
    queryKey: queryKeys.problems.list(),
    queryFn: fetchProblems,
  });
}
