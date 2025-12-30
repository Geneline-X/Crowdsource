"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Calendar, User, Star } from "lucide-react";
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
          className="geist-modal w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-green-50">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Problem Resolved</h3>
              {averageRating > 0 && (
                <div className="flex items-center gap-1 ml-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">({ratingCount})</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-green-200 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("proof")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "proof"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {hasBeforeAfter ? "Before & After" : "Proof"}
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "timeline"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab("rating")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "rating"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Rating
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Problem Title */}
            <div>
              <h4 className="text-lg font-semibold mb-2">{problemTitle}</h4>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-sm font-medium mb-1">Volunteer Notes:</p>
                <p className="text-sm text-gray-700">{resolutionNotes}</p>
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
                      <p className="text-sm font-medium mb-3">Resolution Proof:</p>
                      <div className="relative w-full h-[400px] bg-gray-200 rounded-lg overflow-hidden mb-4">
                        <Image
                          src={resolutionProof[currentImageIndex]}
                          alt={`Resolution proof ${currentImageIndex + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      {resolutionProof.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto">
                          {resolutionProof.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`relative shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                                index === currentImageIndex
                                  ? "border-blue-500 ring-2 ring-blue-200"
                                  : "border-gray-300 hover:border-gray-400"
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
                  <div className="text-center py-8 text-gray-500">Loading timeline...</div>
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

            {/* Success Message */}
            <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
              <p className="text-sm text-green-900">
                ✅ This problem has been successfully resolved by a community volunteer. Thank you for your contribution to making our community better!
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
