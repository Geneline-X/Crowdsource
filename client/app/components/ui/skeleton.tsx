"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[#E8E6E1]",
        className
      )}
    />
  );
}

export function ProblemCardSkeleton() {
  return (
    <div className="p-4 border-b border-[#E8E6E1]">
      <div className="flex gap-3">
        {/* Vote button skeleton */}
        <div className="shrink-0 w-12 h-14 rounded-lg bg-[#F5F3EE] border border-[#E8E6E1]" />

        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          {/* Title */}
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-12" />
          </div>
          
          {/* Description */}
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          
          {/* Badges */}
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          
          {/* Progress bar */}
          <Skeleton className="h-1 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProblemListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="animate-in fade-in duration-300">
      {Array.from({ length: count }).map((_, i) => (
        <ProblemCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="w-full h-full bg-[#F0F1E8] animate-pulse flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#E8E6E1]" />
        <div className="text-sm text-[#525252]">Loading map...</div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="p-4 rounded-xl bg-white border border-[#E8E6E1]">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-[#E8E6E1] p-5 flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <div className="flex-1 space-y-2">
             <Skeleton className="h-4 w-32" />
             <Skeleton className="h-3 w-20" />
          </div>
          <div className="hidden md:flex gap-6">
            <div className="space-y-1"><Skeleton className="h-5 w-10 mx-auto" /><Skeleton className="h-2 w-12" /></div>
            <div className="space-y-1"><Skeleton className="h-5 w-10 mx-auto" /><Skeleton className="h-2 w-12" /></div>
            <div className="space-y-1"><Skeleton className="h-5 w-10 mx-auto" /><Skeleton className="h-2 w-12" /></div>
          </div>
          <div className="text-right space-y-1">
             <Skeleton className="h-6 w-16 ml-auto" />
             <Skeleton className="h-2 w-10 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-[#E8E6E1] p-5 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="w-12 h-4 rounded-full" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
      
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80 w-full rounded-xl bg-white/50" />
        <Skeleton className="h-80 w-full rounded-xl bg-white/50" />
      </div>
      
      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-64 w-full rounded-xl bg-white/50" />
        <Skeleton className="h-64 w-full rounded-xl bg-white/50" />
        <Skeleton className="h-64 w-full rounded-xl bg-white/50" />
      </div>
    </div>
  );
}

export function MinistrySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            <Skeleton className="w-20 h-20 rounded-md shrink-0" />
          </div>
          <div className="flex justify-between items-center">
             <Skeleton className="h-9 w-32 rounded-md" />
             <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
