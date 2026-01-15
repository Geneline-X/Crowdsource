import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  // User preferences
  votedProblems: Set<number>;
visiblePanels: {
    map: boolean;
    activityFeed: boolean;
  };
  
  // UI State
  selectedProblemId: number | null;
  isMapFullscreen: boolean;
  headerTab: "active" | "mapped" | "votes" | "resolved";
  filterTab: "all" | "verified" | "pending";
  searchQuery: string;

  // Actions
  setSelectedProblem: (id: number | null) => void;
  setMapFullscreen: (value: boolean) => void;
  setHeaderTab: (tab: "active" | "mapped" | "votes" | "resolved") => void;
  setFilterTab: (tab: "all" | "verified" | "pending") => void;
  setSearchQuery: (query: string) => void;
  addVotedProblem: (id: number) => void;
  hasVoted: (id: number) => boolean;
  togglePanel: (panel: keyof AppState["visiblePanels"]) => void;
}

// Create persisted store for user preferences
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User preferences (persisted)
      votedProblems: new Set<number>(),
      visiblePanels: {
        map: true,
        activityFeed: true,
      },

      // UI State (not persisted - hydrated fresh)
      selectedProblemId: null,
      isMapFullscreen: false,
      headerTab: "active",
      filterTab: "all",
      searchQuery: "",

      // Actions
      setSelectedProblem: (id) => set({ selectedProblemId: id }),
      setMapFullscreen: (value) => set({ isMapFullscreen: value }),
      setHeaderTab: (tab) => set({ headerTab: tab }),
      setFilterTab: (tab) => set({ filterTab: tab }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      addVotedProblem: (id) =>
        set((state) => ({
          votedProblems: new Set(state.votedProblems).add(id),
        })),
      
      hasVoted: (id) => get().votedProblems.has(id),
      
      togglePanel: (panel) =>
        set((state) => ({
          visiblePanels: {
            ...state.visiblePanels,
            [panel]: !state.visiblePanels[panel],
          },
        })),
    }),
    {
      name: "crowdsource-app-storage",
      // Only persist these fields
      partialize: (state) => ({
        votedProblems: Array.from(state.votedProblems), // Convert Set to Array for JSON
        visiblePanels: state.visiblePanels,
      }),
      // Rehydrate Set from Array
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.votedProblems = new Set(state.votedProblems as unknown as number[]);
        }
      },
    }
  )
);

// Selector hooks for optimized rerenders
export const useSelectedProblem = () => useAppStore((s) => s.selectedProblemId);
export const useMapFullscreen = () => useAppStore((s) => s.isMapFullscreen);
export const useHeaderTab = () => useAppStore((s) => s.headerTab);
export const useFilterTab = () => useAppStore((s) => s.filterTab);
export const useSearchQuery = () => useAppStore((s) => s.searchQuery);
