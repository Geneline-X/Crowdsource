"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Camera, Check, AlertCircle, Loader2, Upload } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";

interface VerifyProblemModalProps {
  problemId: number;
  problemTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  fingerprint: string;
}

export function VerifyProblemModal({
  problemId,
  problemTitle,
  isOpen,
  onClose,
  onSuccess,
  fingerprint,
}: VerifyProblemModalProps) {
  const [step, setStep] = useState<"location" | "images" | "submitting" | "success" | "error">("location");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Get user location
  const getLocation = useCallback(() => {
    setIsGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsGettingLocation(false);
        setStep("images");
      },
      (err) => {
        setLocationError(
          err.code === 1
            ? "Location permission denied. Please enable location access."
            : "Unable to get your location. Please try again."
        );
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Auto-request location on open
  useEffect(() => {
    if (isOpen && step === "location" && !location) {
      getLocation();
    }
  }, [isOpen, step, location, getLocation]);

  // Submit verification
  const submitVerification = async () => {
    if (!location || imageUrls.length === 0) return;

    setStep("submitting");
    setError(null);

    try {
      const response = await fetch(`/api/problems/${problemId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fingerprint,
          latitude: location.lat,
          longitude: location.lng,
          imageUrls,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit verification");
      }

      setStep("success");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setStep("error");
    }
  };

  // Reset on close
  const handleClose = () => {
    setStep("location");
    setLocation(null);
    setImageUrls([]);
    setError(null);
    setLocationError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl border border-[#E8E6E1] shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E8E6E1]">
            <h3 className="font-semibold text-[#262626]">Verify Problem</h3>
            <button onClick={handleClose} className="p-1 hover:bg-[#F5F3EE] rounded text-[#525252]">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-sm text-[#525252] mb-4 line-clamp-2">{problemTitle}</p>

            {/* Step: Location */}
            {step === "location" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--ds-gray-700)]">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm">Step 1: Confirm your location</span>
                </div>

                {isGettingLocation ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[var(--ds-blue-500)]" />
                    <span className="ml-2 text-sm">Getting your location...</span>
                  </div>
                ) : locationError ? (
                  <div className="text-center py-4">
                    <AlertCircle className="w-8 h-8 text-[var(--ds-red-500)] mx-auto mb-2" />
                    <p className="text-sm text-[var(--ds-red-600)]">{locationError}</p>
                    <button
                      onClick={getLocation}
                      className="geist-button geist-button-secondary mt-4"
                    >
                      Try Again
                    </button>
                  </div>
                ) : location ? (
                  <div className="bg-[var(--ds-green-100)] border border-[var(--ds-green-400)] rounded-lg p-3">
                    <div className="flex items-center gap-2 text-[var(--ds-green-600)]">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Location captured</span>
                    </div>
                    <p className="geist-text-mono text-xs mt-1">
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {/* Step: Images */}
            {step === "images" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[var(--ds-gray-700)]">
                  <Camera className="w-5 h-5" />
                  <span className="text-sm">Step 2: Upload verification photos</span>
                </div>

                <UploadDropzone
                  endpoint="verificationImages"
                  onClientUploadComplete={(res) => {
                    const urls = res.map((file) => file.url);
                    setImageUrls((prev) => [...prev, ...urls]);
                  }}
                  onUploadError={(error: Error) => {
                    setError(`Upload failed: ${error.message}`);
                  }}
                  appearance={{
                    container: "border-2 border-dashed border-[var(--ds-gray-400)] rounded-lg p-6 cursor-pointer hover:border-[var(--ds-blue-500)] transition-colors",
                    label: "text-[var(--ds-gray-700)] text-sm",
                    allowedContent: "text-[var(--ds-gray-600)] text-xs",
                    uploadIcon: "text-[var(--ds-gray-600)]",
                  }}
                />

                {imageUrls.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-[var(--ds-gray-700)]">
                      {imageUrls.length} image(s) uploaded
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {imageUrls.map((url, i) => (
                        <div key={i} className="relative w-16 h-16">
                          <img
                            src={url}
                            alt={`Verification ${i + 1}`}
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            onClick={() => setImageUrls((prev) => prev.filter((_, j) => j !== i))}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--ds-red-500)] rounded-full flex items-center justify-center"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={submitVerification}
                  disabled={imageUrls.length === 0}
                  className="geist-button geist-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Verification
                </button>
              </div>
            )}

            {/* Step: Submitting */}
            {step === "submitting" && (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--ds-blue-500)]" />
                <p className="mt-4 text-sm">Submitting verification...</p>
              </div>
            )}

            {/* Step: Success */}
            {step === "success" && (
              <div className="flex flex-col items-center py-8">
                <div className="w-12 h-12 rounded-full bg-[var(--ds-green-100)] flex items-center justify-center">
                  <Check className="w-6 h-6 text-[var(--ds-green-600)]" />
                </div>
                <p className="mt-4 text-sm font-medium">Verification submitted!</p>
                <p className="text-xs text-[var(--ds-gray-600)] mt-1">
                  Thank you for helping verify this problem.
                </p>
              </div>
            )}

            {/* Step: Error */}
            {step === "error" && (
              <div className="flex flex-col items-center py-8">
                <div className="w-12 h-12 rounded-full bg-[var(--ds-red-100)] flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-[var(--ds-red-600)]" />
                </div>
                <p className="mt-4 text-sm font-medium text-[var(--ds-red-600)]">{error}</p>
                <button
                  onClick={() => setStep("images")}
                  className="geist-button geist-button-secondary mt-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
