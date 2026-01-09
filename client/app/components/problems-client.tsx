"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldCheck, HandHelping } from "lucide-react";

import { Problem } from "@/lib/types";
import { MapView } from "@/app/components/map-view";
import { SubmitProblemForm } from "@/app/components/submit-problem-form";
import { VerifyProblemModal } from "@/app/components/verify-problem-modal";
import { OfferHelpModal } from "@/app/components/offer-help-modal";
import { ResolutionProofModal } from "@/app/components/resolution-proof-modal";
import { cn } from "@/lib/utils";

const CATEGORY_MAP: Record<string, { label: string; badge: string; dot: string }> = {
  infrastructure: { label: "Infrastructure", badge: "geist-badge-blue", dot: "geist-status-dot-blue" },
  sanitation: { label: "Sanitation", badge: "geist-badge-green", dot: "geist-status-dot-green" },
  safety: { label: "Safety", badge: "geist-badge-red", dot: "geist-status-dot-red" },
  default: { label: "General", badge: "geist-badge-gray", dot: "geist-status-dot-amber" },
};

function getCategoryConfig(locationSource: string | null) {
  if (!locationSource) return CATEGORY_MAP.default;
  return CATEGORY_MAP[locationSource] || CATEGORY_MAP.default;
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
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
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

  // Auto-select problem from URL query parameter (?problem=ID)
  useEffect(() => {
    const problemIdParam = searchParams.get("problem");
    if (problemIdParam) {
      const problemId = parseInt(problemIdParam, 10);
      if (!isNaN(problemId)) {
        // Find the problem in the list
        const problem = initialProblems.find(p => p.id === problemId);
        if (problem) {
          setSelectedId(problemId);
          // Scroll to the problem after a short delay to ensure DOM is ready
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

  // Generate a hashed voter ID for this session
  useEffect(() => {
    const initVoterId = async () => {
      const storedVoterId = localStorage.getItem("crowdsource_vid");
      if (storedVoterId) {
        voterIdRef.current = storedVoterId;
      } else {
        // Generate unique fingerprint and hash it
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
    // Prevent double voting on same problem
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
        // Already voted - track it locally
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
  const totalVotes = problems.reduce((s, p) => s + p.upvoteCount, 0);
  const selectedProblem = selectedId ? problems.find((p) => p.id === selectedId) : null;

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="geist-card p-8 text-center max-w-md">
          <p className="geist-text-subtitle mb-2">Failed to load</p>
          <p className="geist-text-small">{error}</p>
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
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="font-medium">New problem reported!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-8">
        {[
          { label: "Active Issues", value: problems.length },
          { label: "Total Votes", value: totalVotes },
          { label: "With Location", value: problems.filter((p) => p.latitude && p.longitude).length },
        ].map((stat) => (
          <div key={stat.label} className="geist-card p-3 md:p-4">
            <p className="geist-text-label mb-1 text-xs md:text-sm">{stat.label}</p>
            <p className="text-xl md:text-2xl lg:text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <hr className="geist-divider mb-4 md:mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        <div className="lg:col-span-3 order-2 lg:order-1">
          <div className="flex flex-col gap-3 mb-3 md:mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ds-gray-500)]" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="geist-input pl-9 w-full"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-1 overflow-x-auto">
                {[
                  { key: "all", label: "All", count: problems.length },
                  { key: "verified", label: "Verified", count: verifiedCount },
                  { key: "pending", label: "Pending", count: pendingCount },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key as typeof activeFilter)}
                    className={cn(
                      "px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                      activeFilter === tab.key
                        ? "bg-[var(--ds-gray-1000)] text-[var(--ds-background-100)]"
                        : "text-[var(--ds-gray-700)] hover:text-[var(--ds-gray-900)] hover:bg-[var(--ds-gray-100)]"
                    )}
                  >
                    {tab.label}
                    <span className="ml-1 md:ml-1.5 text-xs opacity-60">{tab.count}</span>
                  </button>
                ))}
              </div>
              <p className="geist-text-small text-xs md:text-sm whitespace-nowrap ml-2">{filteredProblems.length} shown</p>
            </div>
          </div>

          <div className="geist-card overflow-hidden">
            {filteredProblems.length === 0 ? (
              <div className="p-4 md:p-8 text-center">
                <p className="geist-text-body text-sm md:text-base">No problems found</p>
              </div>
            ) : (
              <div className="h-[600px] overflow-y-auto pr-1">
                <AnimatePresence mode="popLayout">
                  {filteredProblems.map((problem, index) => {
                    const category = getCategoryConfig(problem.locationSource);
                    const hasLocation = problem.latitude !== null && problem.longitude !== null;
                    const isSelected = selectedId === problem.id;

                    return (
                      <motion.div
                        key={problem.id}
                        data-problem-id={problem.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        onClick={() => {
                          if (hasLocation) {
                            handleSelectProblem(problem.id);
                          } else if (problem.images && problem.images.length > 0) {
                            setSelectedImage({ url: problem.images[0].url, mimeType: problem.images[0].mimeType });
                          }
                        }}
                        className={cn(
                          "geist-entity gap-2 md:gap-3 p-3 md:p-4 border-b border-[var(--ds-gray-200)] last:border-0",
                          (hasLocation || (problem.images && problem.images.length > 0)) && "cursor-pointer",
                          isSelected && "bg-[var(--ds-blue-100)] border-l-2 border-l-[var(--ds-blue-500)]"
                        )}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(problem.id);
                          }}
                          disabled={votedProblems.has(problem.id)}
                          className={cn(
                            "geist-vote shrink-0 px-2 md:px-3 py-1 md:py-2",
                            votedProblems.has(problem.id) && "opacity-60 cursor-not-allowed"
                          )}
                        >
                          <div className={cn(
                            "geist-vote-arrow",
                            votedProblems.has(problem.id) && "text-green-500"
                          )} />
                          <span className="geist-vote-count text-sm md:text-base">{problem.upvoteCount}</span>
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 md:gap-2 mb-1">
                            <div className={cn("geist-status-dot", category.dot)} />
                            <h3 className="font-medium truncate text-sm md:text-base">{problem.title}</h3>
                            {hasLocation && (
                              <span className="text-[9px] md:text-[10px] px-1 md:px-1.5 py-0.5 rounded bg-[var(--ds-gray-200)] text-[var(--ds-gray-700)]">
                                MAP
                              </span>
                            )}
                          </div>
                          <p className="geist-text-small line-clamp-2 mb-2 text-xs md:text-sm">
                            {problem.rawMessage}
                          </p>
                          
                          {/* Timeline */}
                          <div className="mb-3 p-2 bg-[var(--ds-gray-50)] rounded-md border border-[var(--ds-gray-200)]">
                            <div className="flex items-start gap-2">
                              <div className="flex flex-col items-center gap-1 pt-0.5">
                                <div className="w-2 h-2 rounded-full bg-[var(--ds-blue-500)]" />
                                {problem.verificationCount > 0 && (
                                  <>
                                    <div className="w-0.5 h-3 bg-[var(--ds-gray-300)]" />
                                    <div className="w-2 h-2 rounded-full bg-[var(--ds-green-500)]" />
                                  </>
                                )}
                                {problem.status === "RESOLVED" && problem.resolvedAt && (
                                  <>
                                    <div className="w-0.5 h-3 bg-[var(--ds-gray-300)]" />
                                    <div className="w-2 h-2 rounded-full bg-[var(--ds-green-600)]" />
                                  </>
                                )}
                              </div>
                              <div className="flex-1 space-y-2 text-xs">
                                <div>
                                  <p className="font-medium text-[var(--ds-gray-900)]">Reported</p>
                                  <p className="text-[var(--ds-gray-600)]">
                                    {new Date(problem.createdAt).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                {problem.verificationCount > 0 && (
                                  <div>
                                    <p className="font-medium text-[var(--ds-green-700)]">
                                      {problem.verificationCount} {problem.verificationCount === 1 ? 'Verification' : 'Verifications'}
                                    </p>
                                    <p className="text-[var(--ds-gray-600)]">Community verified</p>
                                  </div>
                                )}
                                {problem.status === "RESOLVED" && problem.resolvedAt && (
                                  <div>
                                    <p className="font-medium text-[var(--ds-green-700)]">Resolved</p>
                                    <p className="text-[var(--ds-gray-600)]">
                                      {new Date(problem.resolvedAt).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {problem.images && problem.images.length > 0 && (
                            <div className="mb-2">
                              <div className="flex gap-1.5 md:gap-2 mb-1">
                                {problem.images.slice(0, 3).map((image, idx) => (
                                  <div key={idx} className="relative group">
                                    <Image
                                      src={image.url}
                                      alt="Problem image"
                                      width={80}
                                      height={80}
                                      sizes="(max-width: 768px) 64px, 80px"
                                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border-2 border-[var(--ds-gray-200)] cursor-pointer hover:border-[var(--ds-blue-500)] transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImage({ url: image.url, mimeType: image.mimeType });
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                                      <svg className="w-5 h-5 md:w-6 md:h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                      </svg>
                                    </div>
                                  </div>
                                ))}
                                {problem.images.length > 3 && (
                                  <div className="w-16 h-16 md:w-20 md:h-20 bg-[var(--ds-gray-100)] rounded-lg border-2 border-[var(--ds-gray-200)] flex flex-col items-center justify-center text-xs text-[var(--ds-gray-600)]">
                                    <span className="font-semibold text-xs md:text-sm">+{problem.images.length - 3}</span>
                                    <span className="text-[10px] md:text-xs">more</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-[var(--ds-gray-500)]">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                                <span>{problem.images.length} image{problem.images.length > 1 ? 's' : ''} attached</span>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                            <span className="geist-text-mono text-[var(--ds-gray-600)] text-xs hidden sm:inline">
                              {problem.title}
                            </span>
                            {problem.nationalCategory && (
                              <span className="geist-badge geist-badge-blue text-[10px] md:text-xs">
                                {problem.nationalCategory}
                              </span>
                            )}
                            <span className={cn("geist-badge text-[10px] md:text-xs", category.badge)}>
                              {problem.locationVerified ? "Verified" : "Pending"}
                            </span>
                            {/* RESOLVED Badge */}
                            {problem.status === "RESOLVED" && (
                              <span className="geist-badge geist-badge-green text-[10px] md:text-xs flex items-center gap-1">
                                ✅ RESOLVED
                              </span>
                            )}
                            {/* Verify Button */}
                            {!problem.locationVerified && problem.status !== "RESOLVED" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setVerifyProblemId(problem.id);
                                  setVerifyModalOpen(true);
                                }}
                                className="geist-button geist-button-secondary h-6 px-2 text-[10px] md:text-xs flex items-center gap-1"
                              >
                                <ShieldCheck className="w-3 h-3" />
                                Verify
                              </button>
                            )}
                            {/* I can fix this Button - only show if not resolved */}
                            {problem.status !== "RESOLVED" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOfferHelpProblemId(problem.id);
                                  setOfferHelpModalOpen(true);
                                }}
                                className="geist-button geist-button-secondary h-6 px-2 text-[10px] md:text-xs flex items-center gap-1"
                              >
                                <HandHelping className="w-3 h-3" />
                                I can fix this
                              </button>
                            )}
                            {/* View Resolution Button - only show if resolved */}
                            {problem.status === "RESOLVED" && problem.resolutionProof && problem.resolutionProof.length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedResolutionProblem(problem);
                                  setResolutionProofModalOpen(true);
                                }}
                                className="geist-button geist-button-primary h-6 px-2 text-[10px] md:text-xs"
                              >
                                View Resolution
                              </button>
                            )}
                            {/* Verification count badge */}
                            {problem.verificationCount > 0 && (

                              <span className="text-[10px] text-[var(--ds-green-600)] flex items-center gap-0.5">
                                <ShieldCheck className="w-3 h-3" />
                                {problem.verificationCount}/3
                              </span>
                            )}
                          </div>

                          {/* Verification Images */}
                          {problem.verifications && problem.verifications.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-[var(--ds-gray-200)]">
                              <p className="text-[10px] font-medium text-[var(--ds-gray-500)] mb-1.5 uppercase tracking-wider">
                                Community Verifications
                              </p>
                              <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-1">
                                {problem.verifications.flatMap(v => v.imageUrls).map((url, idx) => (
                                  <div key={`ver-img-${idx}`} className="relative group shrink-0">
                                    <Image
                                      src={url}
                                      alt="Verification evidence"
                                      width={60}
                                      height={60}
                                      className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-md border border-[var(--ds-gray-200)] cursor-pointer hover:border-[var(--ds-green-500)] transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImage({ url, mimeType: 'image/jpeg' });
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="geist-progress mt-3">
                            <div
                              className="geist-progress-bar"
                              style={{ width: `${(problem.upvoteCount / maxVotes) * 100}%` }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 order-1 lg:order-2">
          <div className="lg:sticky lg:top-20 space-y-4">
            <div>
              <SubmitProblemForm onSuccess={fetchProblems} />
            </div>
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <p className="geist-text-label text-xs md:text-sm">Geographic View</p>
              <button
                onClick={() => setIsMapFullscreen(true)}
                className="geist-button geist-button-secondary text-xs h-6 md:h-7 px-2"
              >
                Expand
              </button>
            </div>
            <div className="geist-card overflow-hidden h-64 md:h-96">
              <MapView
                problems={problems.filter((p) => 
                  (p.latitude !== null && p.longitude !== null) || 
                  (p.verifications && p.verifications.length > 0)
                )}
                onSelectProblem={(id) => setSelectedId(id)}
                selectedProblemId={selectedId}
                centerOnProblem={selectedProblem}
              />
            </div>
            {selectedProblem && (
              <div className="mt-2 p-2 md:p-3 geist-card bg-[var(--ds-blue-100)]">
                <p className="geist-text-small font-medium text-[var(--ds-blue-700)] text-xs md:text-sm">
                  Selected: {selectedProblem.title}
                </p>
                <button
                  onClick={() => setSelectedId(null)}
                  className="geist-text-small text-[var(--ds-gray-600)] mt-1 hover:underline text-xs md:text-sm"
                >
                  Clear selection
                </button>
              </div>
            )}
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
            className="fixed inset-0 z-50 bg-[var(--ds-background-100)]"
          >
            <div className="absolute top-2 md:top-4 right-2 md:right-4 z-10 flex gap-2">
              {selectedProblem && (
                <div className="geist-card p-2 md:p-3 bg-[var(--ds-blue-100)] max-w-[200px] md:max-w-none">
                  <p className="geist-text-small font-medium text-xs md:text-sm truncate">{selectedProblem.title}</p>
                  <p className="geist-text-small text-[var(--ds-gray-600)] text-xs">
                    {selectedProblem.upvoteCount} votes
                  </p>
                </div>
              )}
              <button
                onClick={() => setIsMapFullscreen(false)}
                className="geist-button geist-button-primary text-sm md:text-base h-8 md:h-9 px-3 md:px-4"
              >
                Close
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
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.url}
                alt="Problem image"
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-contain rounded-lg"
                priority
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 md:top-4 right-2 md:right-4 bg-white rounded-full p-1.5 md:p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <a
                href={selectedImage.url}
                download="problem-image"
                className="absolute bottom-2 md:bottom-4 right-2 md:right-4 bg-white rounded-full p-1.5 md:p-2 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
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
          beforeImages={[]} // TODO: Get from problem responses
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

