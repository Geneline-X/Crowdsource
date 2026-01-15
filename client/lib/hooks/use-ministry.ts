"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

interface ProblemImage {
  id: number;
  url: string;
  mimeType: string;
  size: number;
}

export interface MinistryProblem {
  id: number;
  reporterPhone: string;
  rawMessage: string;
  title: string;
  locationText?: string;
  latitude?: number;
  longitude?: number;
  locationVerified: boolean;
  locationSource?: string;
  nationalCategory?: string;
  recommendedOffice?: string;
  status: 'REPORTED' | 'IN_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  upvoteCount: number;
  images: ProblemImage[];
}

interface PaginatedResponse {
  success: boolean;
  data: MinistryProblem[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

interface FetchOptions {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}

// Fetch ministry problems
async function fetchMinistryProblems({ page, limit, status, search }: FetchOptions): Promise<PaginatedResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(status && { status }),
    ...(search && { search }),
  });

  const response = await fetch(`${SERVER_URL}/api/ministry/problems?${params}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch problems");
  }
  
  return response.json();
}

// Update problem status
async function updateProblemStatus({ id, status }: { id: number; status: string }) {
  const response = await fetch(`${SERVER_URL}/api/ministry/problems/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update status");
  }
  
  return response.json();
}

/**
 * Hook for fetching ministry problems with pagination and filtering
 */
export function useMinistryProblems(options: FetchOptions) {
  return useQuery({
    queryKey: ["ministry-problems", options],
    queryFn: () => fetchMinistryProblems(options),
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook for updating problem status with optimistic updates
 */
export function useUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProblemStatus,
    
    // Optimistic update
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["ministry-problems"] });

      // Find all queries that might contain this problem
      const queries = queryClient.getQueriesData<PaginatedResponse>({ queryKey: ["ministry-problems"] });
      
      // Snapshot of previous data
      const previousData = queries;

      // Optimistically update all matching queries
      queries.forEach(([queryKey, oldData]) => {
        if (!oldData) return;
        
        queryClient.setQueryData<PaginatedResponse>(queryKey, {
          ...oldData,
          data: oldData.data.map((p) => 
            p.id === id ? { ...p, status: status as MinistryProblem['status'] } : p
          ),
        });
      });

      return { previousData };
    },

    // Rollback on error
    onError: (err, newStatus, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    // Always refetch to ensure consistency
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ministry-problems"] });
    },
  });
}
