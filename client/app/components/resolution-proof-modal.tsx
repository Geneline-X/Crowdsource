"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Calendar, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ResolutionProofModalProps {
  problemTitle: string;
  resolutionProof: string[];
  resolvedAt: string;
  resolvedBy?: string;
  resolutionNotes?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ResolutionProofModal({
  problemTitle,
  resolutionProof,
  resolvedAt,
  resolvedBy,
  resolutionNotes,
  isOpen,
  onClose,
}: ResolutionProofModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

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
          <div className="flex items-center justify-between p-4 border-b border-[var(--ds-gray-400)] bg-[var(--ds-green-100)]">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[var(--ds-green-600)]" />
              <h3 className="font-semibold text-[var(--ds-green-900)]">Problem Resolved</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[var(--ds-green-200)] rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
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
              <div className="p-4 bg-[var(--ds-gray-100)] rounded-lg">
                <p className="text-sm font-medium mb-1">Volunteer Notes:</p>
                <p className="text-sm text-[var(--ds-gray-700)]">{resolutionNotes}</p>
              </div>
            )}

            {/* Resolution Proof Images */}
            {resolutionProof && resolutionProof.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-3">Resolution Proof:</p>
                
                {/* Main Image */}
                <div className="relative w-full h-[400px] bg-[var(--ds-gray-200)] rounded-lg overflow-hidden mb-4">
                  <Image
                    src={resolutionProof[currentImageIndex]}
                    alt={`Resolution proof ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Thumbnails */}
                {resolutionProof.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {resolutionProof.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? "border-[var(--ds-blue-500)] ring-2 ring-[var(--ds-blue-200)]"
                            : "border-[var(--ds-gray-300)] hover:border-[var(--ds-gray-400)]"
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
            )}

            {/* Success Message */}
            <div className="p-4 bg-[var(--ds-green-50)] border border-[var(--ds-green-300)] rounded-lg">
              <p className="text-sm text-[var(--ds-green-900)]">
                ✅ This problem has been successfully resolved by a community volunteer. Thank you for your contribution to making our community better!
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
