import { QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 1000 * 30, // 30 seconds - data stays fresh
        gcTime: 1000 * 60 * 5, // 5 minutes - garbage collection
        refetchOnWindowFocus: true, // Refetch when user returns to tab
        refetchOnReconnect: true, // Refetch when network reconnects
        retry: 2, // Retry failed requests twice
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: 1,
        onError: (error) => {
          console.error("Mutation error:", error);
        },
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

// Export query keys for consistent cache management
export const queryKeys = {
  problems: {
    all: ["problems"] as const,
    list: () => [...queryKeys.problems.all, "list"] as const,
    detail: (id: number) => [...queryKeys.problems.all, "detail", id] as const,
    heatmap: () => [...queryKeys.problems.all, "heatmap"] as const,
  },
  analytics: {
    all: ["analytics"] as const,
    stats: () => [...queryKeys.analytics.all, "stats"] as const,
  },
} as const;
