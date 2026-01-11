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
  Bot, 
  MapPin,
  ChevronUp,
  Clock,
  Eye,
  Maximize2,
  X,
  Download,
  Filter,
  Activity
} from "lucide-react";

import { Problem } from "@/lib/types";
import { MapView } from "@/app/components/map-view";
import { SubmitProblemForm } from "@/app/components/submit-problem-form";
import { VerifyProblemModal } from "@/app/components/verify-problem-modal";
import { OfferHelpModal } from "@/app/components/offer-help-modal";
import { ResolutionProofModal } from "@/app/components/resolution-proof-modal";
import { cn } from "@/lib/utils";

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
  const [problems, setProblems] = useState<Problem[]>(initialProblems);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "verified" | "pending">("all");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [previousProblemCount, setPreviousProblemCount] = useState<number>(initialProblems.length);
  const [newProblemDetected, setNewProblemDetected] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; mimeType: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [votedProblems, setVotedProblems] = useState<Set<number>>(new Set());
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyProblemId, setVerifyProblemId] = useState<number | null>(null);
  const [offerHelpModalOpen, setOfferHelpModalOpen] = useState(false);
  const [offerHelpProblemId, setOfferHelpProblemId] = useState<number | null>(null);
  const [resolutionProofModalOpen, setResolutionProofModalOpen] = useState(false);
  const [selectedResolutionProblem, setSelectedResolutionProblem] = useState<Problem | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const voterIdRef = useRef<string>("");

  useEffect(() => {
    const problemIdParam = searchParams.get("problem");
    if (problemIdParam) {
      const problemId = parseInt(problemIdParam, 10);
      if (!isNaN(problemId)) {
        const problem = initialProblems.find(p => p.id === problemId);
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
  }, [searchParams, initialProblems]);

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

  const fetchProblems = useCallback(async () => {
    try {
      const response = await fetch("/api/problems");
      if (!response.ok) {
        throw new Error("Failed to fetch problems");
      }
      const data = await response.json();
      
      if (data.length > previousProblemCount && previousProblemCount > 0) {
        setNewProblemDetected(true);
        setTimeout(() => setNewProblemDetected(false), 3000);
      }
      
      setProblems(data);
      setPreviousProblemCount(data.length);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [previousProblemCount]);

  // Set initial lastUpdated on mount (hydration-safe)
  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    pollingRef.current = setInterval(() => {
      fetchProblems();
    }, 5000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [fetchProblems]);

  const handleVote = useCallback(async (id: number) => {
    if (votedProblems.has(id)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/problems/${id}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterPhone: voterIdRef.current || "anonymous" }),
      });

      if (response.ok) {
        setVotedProblems(prev => new Set(prev).add(id));
        fetchProblems();
      } else if (response.status === 409) {
        setVotedProblems(prev => new Set(prev).add(id));
      }
    } catch (err) {
      console.error("Failed to upvote problem:", err);
    }
  }, [fetchProblems, votedProblems]);

  const handleSelectProblem = useCallback((id: number) => {
    const problem = problems.find((p) => p.id === id);
    if (problem && problem.latitude && problem.longitude) {
      setSelectedId(id);
    }
  }, [problems]);

  const sorted = [...problems].sort((a, b) => b.upvoteCount - a.upvoteCount);
  
  const filteredProblems = sorted.filter((p) => {
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
  
  const maxVotes = Math.max(...problems.map((p) => p.upvoteCount), 1);
  const selectedProblem = selectedId ? problems.find((p) => p.id === selectedId) : null;

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="geist-card-glass p-8 text-center max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-lg font-semibold text-white mb-2">Failed to load</p>
          <p className="text-sm text-gray-500">{error}</p>
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

      {/* Immersive Full-Height Layout */}
      <div className="h-full flex flex-col lg:flex-row">
        {/* Left Panel - Problems List (Full width on mobile) */}
        <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 h-full flex flex-col border-r border-white/[0.06] bg-black lg:bg-black/80 lg:backdrop-blur-xl z-10">
          {/* Compact Header with Submit */}
          <div className="shrink-0 p-4 border-b border-white/[0.06]">
            <SubmitProblemForm onSuccess={fetchProblems} />
          </div>

          {/* Search and Filters */}
          <div className="shrink-0 p-4 space-y-3 border-b border-white/[0.06]">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="geist-input pl-10 h-10 w-full text-sm"
              />
            </div>
            
            {/* Filter Tabs */}
            <div className="flex items-center justify-between">
              <div className="flex p-0.5 bg-white/[0.03] rounded-lg border border-white/[0.06]">
                {[
                  { key: "all", label: "All", count: problems.length },
                  { key: "verified", label: "Verified", count: verifiedCount },
                  { key: "pending", label: "Pending", count: pendingCount },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key as typeof activeFilter)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                      activeFilter === tab.key
                        ? "bg-white text-black shadow-sm"
                        : "text-gray-500 hover:text-white"
                    )}
                  >
                    {tab.label}
                    <span className={cn(
                      "ml-1.5",
                      activeFilter === tab.key ? "text-gray-600" : "text-gray-600"
                    )}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
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
                  const hasVoted = votedProblems.has(problem.id);

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
                        "group p-4 border-b border-white/[0.04] transition-all duration-200",
                        (hasLocation || (problem.images && problem.images.length > 0)) && "cursor-pointer hover:bg-white/[0.02]",
                        isSelected && "bg-blue-500/10 border-l-2 border-l-blue-500"
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
                              ? "bg-emerald-500/10 border-emerald-500/30 cursor-default" 
                              : "bg-white/[0.02] border-white/[0.06] hover:bg-emerald-500/10 hover:border-emerald-500/30"
                          )}
                        >
                          <ChevronUp className={cn(
                            "w-4 h-4 transition-colors",
                            hasVoted ? "text-emerald-400" : "text-gray-500 group-hover:text-emerald-400"
                          )} />
                          <span className={cn(
                            "text-base font-bold",
                            hasVoted ? "text-emerald-400" : "text-white"
                          )}>
                            {problem.upvoteCount}
                          </span>
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <h3 className="font-medium text-sm text-white truncate">{problem.title}</h3>
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
                          <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                            {problem.rawMessage}
                          </p>
                          
                          {/* AI Insights - Compact */}
                          {(problem.aiCategory || (problem.severityScore && problem.severityScore > 0)) && (
                            <div className="mb-2 p-2 rounded-lg bg-violet-500/5 border border-violet-500/10">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Bot className="w-3 h-3 text-violet-400" />
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
                              <span className="geist-badge geist-badge-blue text-[10px] h-5">{problem.nationalCategory}</span>
                            )}
                            <span className={cn(
                              "geist-badge text-[10px] h-5",
                              problem.locationVerified ? "geist-badge-green" : "geist-badge-amber"
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
                              <span className="geist-badge geist-badge-green text-[10px] h-5 flex items-center gap-0.5">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                RESOLVED
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
                                className="geist-button-gradient h-5 px-2 text-[10px] rounded-md font-medium"
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
                          <div className="geist-progress mt-3 h-0.5">
                            <motion.div
                              className="geist-progress-bar"
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
          <div className="shrink-0 p-3 border-t border-white/[0.06]">
            {/* Mobile Map Button */}
            <button
              onClick={() => setIsMapFullscreen(true)}
              className="lg:hidden w-full mb-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-medium text-sm shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              View Map
              <span className="text-xs opacity-75">({problems.filter(p => p.latitude && p.longitude).length} locations)</span>
            </button>
            
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <Clock className="w-3 h-3" />
              <span>Updated {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--:--'}</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Map View (Hidden on mobile, visible on desktop) */}
        <div className="hidden lg:block flex-1 relative">
          {/* Gradient Overlay - Top */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 via-black/20 to-transparent z-10 pointer-events-none" />
          
          {/* Map Label - Floating (Right side) */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-sm text-white">Geographic View</span>
            </div>
            <button
              onClick={() => setIsMapFullscreen(true)}
              className="p-2 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 hover:bg-black/80 transition-colors text-gray-400 hover:text-white"
            >
              <Maximize2 className="w-4 h-4" />
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
                className="p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
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
            fetchProblems();
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
            fetchProblems();
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
          canRate={votedProblems.has(selectedResolutionProblem.id)}
          fingerprint={voterIdRef.current}
          isOpen={resolutionProofModalOpen}
          onClose={() => {
            setResolutionProofModalOpen(false);
            setSelectedResolutionProblem(null);
          }}
        />
      )}
    </>
  );
}
