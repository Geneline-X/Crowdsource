"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShieldCheck,
  HandHelping,
  AlertTriangle,
  MapPin,
  ChevronUp,
  Clock,
  Eye,
  Maximize2,
  X,
  Download,
  Filter,
  Activity,
  CheckCircle,
  Users,
  ThumbsUp,
  TrendingUp
} from "lucide-react";

import { Problem } from "@/lib/types";
import { useProblems, useUpvote } from "@/lib/hooks/use-problems";
import { useAppStore } from "@/lib/stores/app-store";
import { MapView } from "@/app/components/map-view";
import { SubmitProblemForm } from "@/app/components/submit-problem-form";
import { VerifyProblemModal } from "@/app/components/verify-problem-modal";
import { OfferHelpModal } from "@/app/components/offer-help-modal";
import { ResolutionProofModal } from "@/app/components/resolution-proof-modal";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-client";

const CATEGORY_MAP: Record<string, { label: string; gradient: string; }> = {
  infrastructure: { label: "Infrastructure", gradient: "from-blue-500 to-cyan-500" },
  sanitation: { label: "Sanitation", gradient: "from-emerald-500 to-green-500" },
  safety: { label: "Safety", gradient: "from-red-500 to-rose-500" },
  default: { label: "General", gradient: "from-gray-500 to-gray-600" },
};

function getCategoryConfig(locationSource: string | null) {
  if (!locationSource) return CATEGORY_MAP.default;
  return CATEGORY_MAP[locationSource] || CATEGORY_MAP.default;
}

function getSeverityConfig(score: number | undefined): { level: string; color: string; bgColor: string; borderColor: string } {
  if (!score || score < 25) {
    return { level: "Low", color: "text-emerald-400", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/20" };
  } else if (score < 50) {
    return { level: "Medium", color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/20" };
  } else if (score < 75) {
    return { level: "High", color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/20" };
  } else {
    return { level: "Critical", color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/20" };
  }
}

interface ProblemsClientProps {
  initialProblems: Problem[];
}

export function ProblemsClient({ initialProblems }: ProblemsClientProps) {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // React Query hooks for data fetching with optimistic updates
  const { data: problems = initialProblems, isLoading, error: queryError, dataUpdatedAt, refetch } = useProblems({ pollingInterval: 5000 });
  const upvoteMutation = useUpvote();

  // Zustand store for persisted voted problems
  const { addVotedProblem, hasVoted: storeHasVoted } = useAppStore();

  // Refetch function to replace the old fetchProblems
  const refetchProblems = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.problems.list() });
  }, [queryClient]);

  // Local UI state
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "verified" | "pending">("all");
  const [newProblemDetected, setNewProblemDetected] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; mimeType: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyProblemId, setVerifyProblemId] = useState<number | null>(null);
  const [offerHelpModalOpen, setOfferHelpModalOpen] = useState(false);
  const [offerHelpProblemId, setOfferHelpProblemId] = useState<number | null>(null);
  const [resolutionProofModalOpen, setResolutionProofModalOpen] = useState(false);
  const [selectedResolutionProblem, setSelectedResolutionProblem] = useState<Problem | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [headerTab, setHeaderTab] = useState<"active" | "mapped" | "votes" | "resolved">("active");
  const voterIdRef = useRef<string>("");
  const previousCountRef = useRef<number>(initialProblems.length);

  // Detect new problems
  useEffect(() => {
    if (problems.length > previousCountRef.current && previousCountRef.current > 0) {
      setNewProblemDetected(true);
      setTimeout(() => setNewProblemDetected(false), 3000);
    }
    previousCountRef.current = problems.length;
  }, [problems.length]);

  useEffect(() => {
    const problemIdParam = searchParams.get("problem");
    if (problemIdParam) {
      const problemId = parseInt(problemIdParam, 10);
      if (!isNaN(problemId)) {
        const problem = problems.find(p => p.id === problemId);
        if (problem) {
          setSelectedId(problemId);
          setTimeout(() => {
            const element = document.querySelector(`[data-problem-id="${problemId}"]`);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 500);
        }
      }
    }
  }, [searchParams, problems]);

  useEffect(() => {
    const initVoterId = async () => {
      const storedVoterId = localStorage.getItem("crowdsource_vid");
      if (storedVoterId) {
        voterIdRef.current = storedVoterId;
      } else {
        const fingerprint = `${navigator.userAgent}_${screen.width}x${screen.height}_${new Date().getTimezoneOffset()}_${Date.now()}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(fingerprint);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashedId = hashArray.map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
        localStorage.setItem("crowdsource_vid", hashedId);
        voterIdRef.current = hashedId;
      }
    };
    initVoterId();
  }, []);

  // Optimistic upvote handler - instant feedback!
  const handleVote = useCallback((id: number) => {
    if (storeHasVoted(id)) return;

    upvoteMutation.mutate({
      id,
      voterPhone: voterIdRef.current || "anonymous",
    });
  }, [storeHasVoted, upvoteMutation]);

  const handleSelectProblem = useCallback((id: number) => {
    const problem = problems.find((p) => p.id === id);
    if (problem && problem.latitude && problem.longitude) {
      setSelectedId(id);
    }
  }, [problems]);

  const sorted = [...problems].sort((a, b) => b.upvoteCount - a.upvoteCount);

  // Apply header tab filter first
  const headerFiltered = sorted.filter((p) => {
    switch (headerTab) {
      case "active":
        return p.status !== "RESOLVED";
      case "mapped":
        return (p.latitude !== null && p.longitude !== null) || (p.verifications && p.verifications.length > 0);
      case "votes":
        return p.upvoteCount > 0;
      case "resolved":
        return p.status === "RESOLVED";
      default:
        return true;
    }
  });

  const filteredProblems = headerFiltered.filter((p) => {
    const matchesFilter =
      activeFilter === "all" ? true :
        activeFilter === "verified" ? p.locationVerified :
          !p.locationVerified;

    if (!matchesFilter) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(query) ||
        p.rawMessage.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const verifiedCount = problems.filter((p) => p.locationVerified).length;
  const pendingCount = problems.filter((p) => !p.locationVerified).length;
  const resolvedCount = problems.filter((p) => p.status === "RESOLVED").length;
  const totalVotes = problems.reduce((sum, p) => sum + p.upvoteCount, 0);

  const maxVotes = Math.max(...problems.map((p) => p.upvoteCount), 1);
  const selectedProblem = selectedId ? problems.find((p) => p.id === selectedId) : null;
  const anyModalOpen = verifyModalOpen || offerHelpModalOpen || resolutionProofModalOpen || showSubmitForm || !!selectedImage;

  if (queryError) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="geist-card-glass p-8 text-center max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-2">Failed to load</p>
          <p className="text-sm text-gray-500">{queryError.message}</p>
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
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="font-medium text-sm">New problem reported!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Header */}
      <div className="content-header">
        <div className="content-header-tabs">
          {[
            { key: "active", label: "Active" },
            { key: "mapped", label: "Mapped" },
            { key: "votes", label: "Votes" },
            { key: "resolved", label: "Resolved" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setHeaderTab(tab.key as typeof headerTab)}
              className={cn(
                "content-header-tab",
                headerTab === tab.key && "content-header-tab-active"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button className="report-btn" onClick={() => setShowSubmitForm(true)}>
          Report a problem
        </button>
      </div>

      {/* Impact Banner */}
      <div className="impact-banner">
        <div className="impact-banner-header">
          <div className="impact-banner-title-section">
            <h2 className="impact-banner-title">Community Impact</h2>
            <p className="impact-banner-subtitle">Real-time metrics showing our collective progress</p>
          </div>
          <div className="impact-banner-metrics">
            <div className="impact-metric">
              <span className="impact-metric-value">{resolvedCount}</span>
              <span className="impact-metric-label">
                <CheckCircle className="impact-metric-icon text-green-600" />
                Resolved this month
              </span>
            </div>
            <div className="impact-metric">
              <span className="impact-metric-value">{problems.length}</span>
              <span className="impact-metric-label">
                <Users className="impact-metric-icon text-violet-600" />
                Citizens engaged
              </span>
            </div>
            <div className="impact-metric">
              <span className="impact-metric-value">{totalVotes}</span>
              <span className="impact-metric-label">
                <ThumbsUp className="impact-metric-icon text-amber-600" />
                Upvoted collected
              </span>
            </div>
            <div className="impact-metric">
              <span className="impact-metric-value">{problems.length > 0 ? Math.round((resolvedCount / problems.length) * 100) : 0}%</span>
              <span className="impact-metric-label">
                <TrendingUp className="impact-metric-icon text-emerald-600" />
                Resolution Rate
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Full height with fixed sidebar */}
      <div className="flex-1 flex px-3 md:px-6 pb-4 md:pb-6 gap-4 md:gap-6 min-h-0 flex-col lg:flex-row">

        {/* Left Panel - Problem List (Scrollable) */}
        <div className="w-full lg:w-[500px] xl:w-[550px] shrink-0 flex flex-col bg-white rounded-xl border border-[var(--ds-card-border)] overflow-hidden max-h-full">

          {/* Search and Filters */}
          <div className="shrink-0 p-3 md:p-4 space-y-3 border-b border-[var(--ds-card-border)]">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="geist-input pl-10 h-10 w-full text-sm"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex gap-1 p-1 bg-[#F5F3EE] rounded-lg border border-[#E8E6E1] overflow-x-auto">
                {[
                  { key: "all", label: "All", count: problems.length },
                  { key: "verified", label: "Verified", count: verifiedCount },
                  { key: "pending", label: "Pending", count: pendingCount },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key as typeof activeFilter)}
                    className={cn(
                      "px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap",
                      activeFilter === tab.key
                        ? "bg-[#2D5A47] text-white shadow-sm"
                        : "text-[#525252] hover:bg-[#E8E6E1]"
                    )}
                  >
                    {tab.label}
                    <span className={cn(
                      "ml-1.5",
                      activeFilter === tab.key ? "text-white/80" : "text-[#737373]"
                    )}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#525252]">
                <Activity className="w-3 h-3" />
                <span>{filteredProblems.length}</span>
              </div>
            </div>
          </div>

          {/* Problems List - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {filteredProblems.length === 0 ? (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <Filter className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No problems found</p>
                  <p className="text-sm text-gray-600 mt-1">Try adjusting your filters</p>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredProblems.map((problem, index) => {
                  const category = getCategoryConfig(problem.locationSource);
                  const hasLocation = problem.latitude !== null && problem.longitude !== null;
                  const isSelected = selectedId === problem.id;
                  const hasVoted = storeHasVoted(problem.id);

                  return (
                    <motion.div
                      key={problem.id}
                      data-problem-id={problem.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      onClick={() => {
                        if (hasLocation) {
                          handleSelectProblem(problem.id);
                        } else if (problem.images && problem.images.length > 0) {
                          setSelectedImage({ url: problem.images[0].url, mimeType: problem.images[0].mimeType });
                        }
                      }}
                      className={cn(
                        "group p-4 border-b border-[#E8E6E1] transition-all duration-200",
                        (hasLocation || (problem.images && problem.images.length > 0)) && "cursor-pointer hover:bg-[#F5F3EE]",
                        isSelected && "bg-[#4A776610] border-l-4 border-l-[#4A7766]"
                      )}
                    >
                      <div className="flex gap-3">
                        {/* Vote Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(problem.id);
                          }}
                          disabled={hasVoted}
                          className={cn(
                            "shrink-0 w-12 h-14 flex flex-col items-center justify-center gap-0.5 rounded-lg border transition-all duration-200",
                            hasVoted
                              ? "bg-[#4A776620] border-[#4A776650] cursor-default"
                              : "bg-[#F5F3EE] border-[#E8E6E1] hover:bg-[#4A776620] hover:border-[#4A776650]"
                          )}
                        >
                          <ChevronUp className={cn(
                            "w-4 h-4 transition-colors",
                            hasVoted ? "text-[#4A7766]" : "text-[#737373] group-hover:text-[#4A7766]"
                          )} />
                          <span className={cn(
                            "text-base font-bold",
                            hasVoted ? "text-[#4A7766]" : "text-[#262626]"
                          )}>
                            {problem.upvoteCount}
                          </span>
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <h3 className="font-semibold text-sm text-[#262626] truncate">{problem.title}</h3>
                              {hasLocation && (
                                <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                  <MapPin className="w-2.5 h-2.5 inline-block mr-0.5" />
                                  MAP
                                </span>
                              )}
                            </div>
                            <span className="shrink-0 text-[10px] text-gray-600">
                              {new Date(problem.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-[#525252] line-clamp-2 mb-2">
                            {problem.rawMessage}
                          </p>

                          {/* AI Insights - Compact */}
                          {(problem.aiCategory || (problem.severityScore && problem.severityScore > 0)) && (
                            <div className="mb-2 p-2 rounded-lg bg-violet-500/5 border border-violet-500/10">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Activity className="w-3 h-3 text-violet-400" />
                                <span className="text-[10px] font-medium text-violet-400 uppercase tracking-wider">AI</span>
                              </div>
                              <div className="flex flex-wrap gap-2 text-[11px]">
                                {problem.aiCategory && (
                                  <span className="text-gray-400">
                                    <span className="text-violet-300 font-medium">{problem.aiCategory}</span>
                                  </span>
                                )}
                                {problem.severityScore !== undefined && problem.severityScore > 0 && (() => {
                                  const severity = getSeverityConfig(problem.severityScore);
                                  return (
                                    <span className={cn("font-medium", severity.color)}>{severity.level}</span>
                                  );
                                })()}
                              </div>
                            </div>
                          )}

                          {/* Images */}
                          {problem.images && problem.images.length > 0 && (
                            <div className="flex gap-1.5 mb-2">
                              {problem.images.slice(0, 3).map((image, idx) => (
                                <div key={idx} className="relative group/img">
                                  <Image
                                    src={image.url}
                                    alt="Problem"
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 object-cover rounded-md border border-white/[0.06] cursor-pointer transition-transform hover:scale-105"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedImage({ url: image.url, mimeType: image.mimeType });
                                    }}
                                  />
                                  <div className="absolute inset-0 rounded-md bg-black/0 group-hover/img:bg-black/30 transition-colors flex items-center justify-center">
                                    <Eye className="w-3 h-3 text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                                  </div>
                                </div>
                              ))}
                              {problem.images.length > 3 && (
                                <div className="w-12 h-12 rounded-md bg-white/[0.03] border border-white/[0.06] flex flex-col items-center justify-center">
                                  <span className="text-xs font-bold text-gray-400">+{problem.images.length - 3}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Badges & Actions */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {problem.nationalCategory && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#E0D9F6] text-[#5B21B6] border border-[#D4C8F0]">{problem.nationalCategory}</span>
                            )}
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-medium border",
                              problem.locationVerified
                                ? "bg-[#4A776633] text-[#4A7766] border-[#4A776650]"
                                : "bg-amber-100 text-amber-700 border-amber-200"
                            )}>
                              {problem.locationVerified ? "Verified" : "Pending"}
                            </span>

                            {problem.severityScore !== undefined && problem.severityScore > 0 && (() => {
                              const severity = getSeverityConfig(problem.severityScore);
                              return (
                                <span className={cn(
                                  "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium border",
                                  severity.bgColor, severity.color, severity.borderColor
                                )}>
                                  <AlertTriangle className="w-2.5 h-2.5" />
                                  {severity.level}
                                </span>
                              );
                            })()}

                            {problem.status === "RESOLVED" && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#4A776666] text-[#304F44] border border-[#4A776680] flex items-center gap-0.5">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                Resolved
                              </span>
                            )}

                            {/* Actions */}
                            {!problem.locationVerified && problem.status !== "RESOLVED" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setVerifyProblemId(problem.id);
                                  setVerifyModalOpen(true);
                                }}
                                className="geist-button geist-button-secondary h-5 px-2 text-[10px]"
                              >
                                <ShieldCheck className="w-2.5 h-2.5" />
                                Verify
                              </button>
                            )}

                            {problem.status !== "RESOLVED" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOfferHelpProblemId(problem.id);
                                  setOfferHelpModalOpen(true);
                                }}
                                className="geist-button geist-button-secondary h-5 px-2 text-[10px]"
                              >
                                <HandHelping className="w-2.5 h-2.5" />
                                Help
                              </button>
                            )}

                            {problem.status === "RESOLVED" && problem.resolutionProof && problem.resolutionProof.length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedResolutionProblem(problem);
                                  setResolutionProofModalOpen(true);
                                }}
                                className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#5B9BD5] text-white hover:bg-[#4A8BC4] transition-colors"
                              >
                                View Resolution
                              </button>
                            )}

                            {problem.verificationCount > 0 && (
                              <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                {problem.verificationCount}/3
                              </span>
                            )}
                          </div>

                          {/* Progress */}
                          <div className="mt-3 h-1 bg-[#E8E6E1] rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-[#5B9BD5]"
                              initial={{ width: 0 }}
                              animate={{ width: `${(problem.upvoteCount / maxVotes) * 100}%` }}
                              transition={{ duration: 0.5, delay: index * 0.05 }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Footer - Last Updated + Mobile Map Button */}
          <div className="shrink-0 p-3 border-t border-[var(--ds-card-border)]">
            {/* Mobile Map Button */}
            <button
              onClick={() => setIsMapFullscreen(true)}
              className="lg:hidden w-full mb-3 px-4 py-3 rounded-xl bg-[#2D5A47] hover:bg-[#235242] text-white font-medium text-sm shadow-lg shadow-[#2D5A47]/30 flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              View Map
              <span className="text-xs opacity-75">({problems.filter(p => p.latitude && p.longitude).length} locations)</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <Clock className="w-3 h-3" />
              <span>Updated {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '--:--:--'}</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Map View & Chatbot (Hidden on mobile, visible on desktop) */}
        <div className="hidden lg:flex flex-1 flex-col gap-4 overflow-hidden">
          {/* Map View - Top Section (Constrained height) */}
          <div className="relative bg-white rounded-xl border border-[var(--ds-card-border)] overflow-hidden" style={{ flex: '3 1 0', minHeight: '300px' }}>
            {/* Map Header */}
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={() => setIsMapFullscreen(true)}
                className="px-4 py-2 rounded-lg bg-[#937251] text-white text-sm font-medium hover:bg-[#7D6245] transition-colors shadow-sm"
              >
                Expand
              </button>
            </div>

            {/* Selected Problem Info - Floating Card */}
            {selectedProblem && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute bottom-6 left-6 right-6 z-20"
              >
                <div className="p-4 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-white truncate mb-1">
                        {selectedProblem.title}
                      </p>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {selectedProblem.rawMessage}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                          <ChevronUp className="w-4 h-4" />
                          <span className="font-semibold">{selectedProblem.upvoteCount}</span>
                          <span className="text-gray-500">votes</span>
                        </span>
                        {selectedProblem.nationalCategory && (
                          <span className="geist-badge geist-badge-blue">{selectedProblem.nationalCategory}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Full Map */}
            <div className="h-full w-full">
              <MapView
                problems={problems.filter((p) =>
                  (p.latitude !== null && p.longitude !== null) ||
                  (p.verifications && p.verifications.length > 0)
                )}
                onSelectProblem={(id) => setSelectedId(id)}
                selectedProblemId={selectedId}
                centerOnProblem={selectedProblem}
                fullscreen
                showControls={!anyModalOpen && !isMapFullscreen}
              />
            </div>

            {/* Mobile: Expand Map Button */}
            <div className="lg:hidden absolute bottom-4 right-4 z-20">
              <button
                onClick={() => setIsMapFullscreen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-medium text-sm shadow-lg shadow-violet-500/30 flex items-center gap-2"
              >
                <Maximize2 className="w-4 h-4" />
                Expand Map
              </button>
            </div>
          </div>

          {/* Activity Feed - Bottom Section */}
          <div className="flex-1 min-h-[300px] bg-white rounded-xl border border-[var(--ds-card-border)] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#E8E6E1]">
              <h3 className="text-sm font-semibold text-[#262626]">Recent Activity</h3>
              <p className="text-xs text-[#525252]">Live updates from the community</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {problems.slice(0, 10).map((problem) => (
                <div
                  key={problem.id}
                  className="p-3 rounded-lg bg-[#F5F3EE] border border-[#E8E6E1] hover:bg-[#E8E6E1] transition-colors cursor-pointer"
                  onClick={() => handleSelectProblem(problem.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0",
                      problem.status === "RESOLVED" ? "bg-emerald-500" :
                        problem.verificationCount > 0 ? "bg-blue-500" : "bg-amber-500"
                    )}>
                      {problem.status === "RESOLVED" ? <CheckCircle className="w-4 h-4" /> :
                        problem.verificationCount > 0 ? <ShieldCheck className="w-4 h-4" /> :
                          <AlertTriangle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#262626] truncate">{problem.title}</p>
                      <p className="text-xs text-[#525252]">
                        {problem.status === "RESOLVED" ? "Resolved" :
                          problem.verificationCount > 0 ? `${problem.verificationCount} verifications` :
                            "Pending verification"}
                        <span className="mx-1">-</span>
                        {new Date(problem.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-[#4A7766]">{problem.upvoteCount} votes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Map Modal */}
      <AnimatePresence>
        {isMapFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
              {selectedProblem && (
                <div className="px-4 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl">
                  <p className="text-sm font-medium text-white truncate max-w-[200px]">{selectedProblem.title}</p>
                  <p className="text-xs text-gray-400">{selectedProblem.upvoteCount} votes</p>
                </div>
              )}
              <button
                onClick={() => setIsMapFullscreen(false)}
                className="p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-black hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>
            <MapView
              problems={problems.filter((p) =>
                (p.latitude !== null && p.longitude !== null) ||
                (p.verifications && p.verifications.length > 0)
              )}
              onSelectProblem={(id) => setSelectedId(id)}
              selectedProblemId={selectedId}
              centerOnProblem={selectedProblem}
              fullscreen
              showControls={!anyModalOpen}
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
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.url}
                alt="Problem image"
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-contain"
                priority
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <a
                href={selectedImage.url}
                download="problem-image"
                className="absolute bottom-4 right-4 p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-colors"
              >
                <Download className="w-5 h-5 text-white" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verify Problem Modal */}
      {verifyProblemId && (
        <VerifyProblemModal
          problemId={verifyProblemId}
          problemTitle={problems.find(p => p.id === verifyProblemId)?.title || ""}
          isOpen={verifyModalOpen}
          onClose={() => {
            setVerifyModalOpen(false);
            setVerifyProblemId(null);
          }}
          onSuccess={() => {
            refetchProblems();
          }}
          fingerprint={voterIdRef.current}
        />
      )}

      {/* Offer Help Modal */}
      {offerHelpProblemId && (
        <OfferHelpModal
          problemId={offerHelpProblemId}
          problemTitle={problems.find(p => p.id === offerHelpProblemId)?.title || ""}
          isOpen={offerHelpModalOpen}
          onClose={() => {
            setOfferHelpModalOpen(false);
            setOfferHelpProblemId(null);
          }}
          onSuccess={() => {
            refetchProblems();
          }}
          fingerprint={voterIdRef.current}
        />
      )}

      {/* Resolution Proof Modal */}
      {selectedResolutionProblem && (
        <ResolutionProofModal
          problemId={selectedResolutionProblem.id}
          problemTitle={selectedResolutionProblem.title}
          resolutionProof={selectedResolutionProblem.resolutionProof || []}
          beforeImages={[]}
          resolvedAt={selectedResolutionProblem.resolvedAt || ""}
          resolvedBy={selectedResolutionProblem.resolvedBy || undefined}
          resolutionNotes={selectedResolutionProblem.resolutionNotes || undefined}
          averageRating={selectedResolutionProblem.averageRating || undefined}
          ratingCount={selectedResolutionProblem.ratingCount || 0}
          canRate={storeHasVoted(selectedResolutionProblem.id)}
          fingerprint={voterIdRef.current}
          isOpen={resolutionProofModalOpen}
          onClose={() => {
            setResolutionProofModalOpen(false);
            setSelectedResolutionProblem(null);
          }}
        />
      )}

      {/* Submit Problem Form Modal */}
      {showSubmitForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSubmitForm(false)}
          />
          <div className="relative z-10">
            <SubmitProblemForm
              isOpen={showSubmitForm}
              onClose={() => setShowSubmitForm(false)}
              onSuccess={() => {
                refetchProblems();
                setShowSubmitForm(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
