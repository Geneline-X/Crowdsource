"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Calendar, User, Star, Check } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { BeforeAfterComparison } from "./before-after-comparison";
import { ResolutionTimeline } from "./resolution-timeline";
import { VolunteerRating } from "./volunteer-rating";

interface ResolutionProofModalProps {
  problemId: number;
  problemTitle: string;
  resolutionProof: string[];
  beforeImages?: string[];
  resolvedAt: string;
  resolvedBy?: string;
  resolutionNotes?: string;
  averageRating?: number;
  ratingCount?: number;
  canRate?: boolean;
  fingerprint: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ResolutionProofModal({
  problemId,
  problemTitle,
  resolutionProof,
  beforeImages = [],
  resolvedAt,
  resolvedBy,
  resolutionNotes,
  averageRating = 0,
  ratingCount = 0,
  canRate = false,
  fingerprint,
  isOpen,
  onClose,
}: ResolutionProofModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"proof" | "timeline" | "rating">("proof");
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && activeTab === "timeline") {
      fetchTimeline();
    }
    if (isOpen && activeTab === "rating") {
      fetchRatings();
    }
  }, [isOpen, activeTab]);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/problems/${problemId}/timeline`);
      if (response.ok) {
        const data = await response.json();
        setTimelineEvents(data.events || []);
      }
    } catch (error) {
      console.error("Failed to fetch timeline:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/problems/${problemId}/rate`);
      if (response.ok) {
        const data = await response.json();
        setRatings(data.ratings || []);
      }
    } catch (error) {
      console.error("Failed to fetch ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const hasBeforeAfter = beforeImages.length > 0 && resolutionProof.length > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 geist-overlay flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="geist-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--ds-gray-400)]">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[var(--ds-green-600)]" />
              <h3 className="font-semibold">Problem Resolved</h3>
              {averageRating > 0 && (
                <div className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-[var(--ds-gray-200)] rounded-full">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{averageRating.toFixed(1)}</span>
                  <span className="text-xs text-[var(--ds-gray-500)]">({ratingCount})</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[var(--ds-gray-200)] rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-0">
             {/* Tabs */}
            <div className="flex border-b border-[var(--ds-gray-200)] px-4">
              <button
                onClick={() => setActiveTab("proof")}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "proof"
                    ? "border-[var(--ds-blue-500)] text-[var(--ds-blue-600)]"
                    : "border-transparent text-[var(--ds-gray-600)] hover:text-[var(--ds-gray-900)]"
                }`}
              >
                {hasBeforeAfter ? "Before & After" : "Proof"}
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "timeline"
                    ? "border-[var(--ds-blue-500)] text-[var(--ds-blue-600)]"
                    : "border-transparent text-[var(--ds-gray-600)] hover:text-[var(--ds-gray-900)]"
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveTab("rating")}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "rating"
                    ? "border-[var(--ds-blue-500)] text-[var(--ds-blue-600)]"
                    : "border-transparent text-[var(--ds-gray-600)] hover:text-[var(--ds-gray-900)]"
                }`}
              >
                Rating
              </button>
            </div>

            {/* Content Content */}
            <div className="p-6 space-y-6">
              {/* Problem Title */}
              <div>
                <h4 className="text-lg font-semibold mb-2">{problemTitle}</h4>
                <div className="flex flex-wrap gap-4 text-sm text-[var(--ds-gray-600)]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Resolved: {new Date(resolvedAt).toLocaleDateString()}</span>
                  </div>
                  {resolvedBy && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>By community volunteer</span>
                    </div>
                  )}
                </div>
              </div>

               {/* Resolution Notes */}
              {resolutionNotes && (
                <div className="p-4 border border-[var(--ds-gray-200)] rounded-lg">
                  <p className="text-sm font-medium mb-1 text-[var(--ds-gray-900)]">Volunteer Notes:</p>
                  <p className="text-sm text-[var(--ds-gray-700)]">{resolutionNotes}</p>
                </div>
              )}

              {/* Tab Content */}
              {activeTab === "proof" && (
                <>
                  {hasBeforeAfter ? (
                    <BeforeAfterComparison
                      beforeImages={beforeImages}
                      afterImages={resolutionProof}
                    />
                  ) : (
                    /* Original Proof Display */
                    resolutionProof && resolutionProof.length > 0 && (
                      <div>
                        <div className="relative w-full h-[400px] border border-[var(--ds-gray-200)] rounded-lg overflow-hidden mb-4">
                          <Image
                            src={resolutionProof[currentImageIndex]}
                            alt={`Resolution proof ${currentImageIndex + 1}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                        {resolutionProof.length > 1 && (
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {resolutionProof.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`relative shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                                  index === currentImageIndex
                                    ? "border-[var(--ds-blue-500)]"
                                    : "border-[var(--ds-gray-200)] hover:border-[var(--ds-gray-300)]"
                                }`}
                              >
                                <Image
                                  src={image}
                                  alt={`Thumbnail ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </>
              )}

              {activeTab === "timeline" && (
                <div>
                  {loading ? (
                    <div className="flex flex-col items-center py-8 text-[var(--ds-gray-500)]">
                       {/* You might want to import Loader2 here if desired, or just use text */}
                       Loading timeline...
                    </div>
                  ) : (
                    <ResolutionTimeline events={timelineEvents} />
                  )}
                </div>
              )}

              {activeTab === "rating" && (
                <VolunteerRating
                  problemId={problemId}
                  averageRating={averageRating}
                  ratingCount={ratingCount}
                  ratings={ratings}
                  canRate={canRate}
                  fingerprint={fingerprint}
                  onRatingSubmitted={fetchRatings}
                />
              )}

               {/* Success Indicator at bottom */}
               <div className="mt-6 pt-6 border-t border-[var(--ds-gray-200)] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-[var(--ds-green-200)] flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-[var(--ds-green-600)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--ds-gray-900)]">Problem Successfully Resolved</p>
                    <p className="text-xs text-[var(--ds-gray-500)]">Thank you for helping to improve our community.</p>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
