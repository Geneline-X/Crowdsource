"use client";

import { Problem } from "@/lib/types";
import dynamic from "next/dynamic";

const MapClientComponent = dynamic(() => import("./map-client"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] flex items-center justify-center bg-[var(--ds-background-200)]">
      <div className="flex items-center gap-2 text-[var(--ds-gray-600)]">
        <div className="geist-spinner" />
        <span className="geist-text-small">Loading map</span>
      </div>
    </div>
  ),
});

interface MapViewProps {
  problems: Problem[];
  onSelectProblem?: (id: number) => void;
  selectedProblemId?: number | null;
  centerOnProblem?: Problem | null;
  fullscreen?: boolean;
}

export function MapView({
  problems,
  onSelectProblem,
  selectedProblemId,
  centerOnProblem,
  fullscreen = false,
}: MapViewProps) {
  return (
    <div className={fullscreen ? "w-full h-full" : "w-full h-[380px]"}>
      <MapClientComponent
        problems={problems}
        onSelectProblem={onSelectProblem}
        selectedProblemId={selectedProblemId}
        centerOnProblem={centerOnProblem}
      />
    </div>
  );
}
