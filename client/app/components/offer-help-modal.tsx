"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, HandHelping, Loader2, Check, AlertCircle } from "lucide-react";
import { VolunteerList } from "./volunteer-list";

interface Volunteer {
  userPhone: string;
  createdAt: string;
}

interface OfferHelpModalProps {
  problemId: number;
  problemTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  fingerprint: string;
}

export function OfferHelpModal({
  problemId,
  problemTitle,
  isOpen,
  onClose,
  onSuccess,
  fingerprint,
}: OfferHelpModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);

  // Fetch existing volunteers when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchVolunteers();
    }
  }, [isOpen, problemId]);

  const fetchVolunteers = async () => {
    setLoadingVolunteers(true);
    try {
      const response = await fetch(`/api/problems/${problemId}/responses`);
      if (response.ok) {
        const data = await response.json();
        setVolunteers(data.volunteers || []);
      }
    } catch (err) {
      console.error("Failed to fetch volunteers:", err);
    } finally {
      setLoadingVolunteers(false);
    }
  };

  const handleSubmit = async () => {
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/problems/${problemId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPhone: phoneNumber.trim(),
          fingerprint,
          message: message.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit response");
      }

      setSuccess(true);
      // Refresh volunteers list to include this user
      await fetchVolunteers();
      
      setTimeout(() => {
        onSuccess();
        onClose();
        handleReset();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setPhoneNumber("");
    setMessage("");
    setSuccess(false);
    setError(null);
  };

  const handleClose = () => {
    handleReset();
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
          className="bg-white rounded-xl border border-[#E8E6E1] shadow-xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E8E6E1]">
            <div className="flex items-center gap-2">
              <HandHelping className="w-5 h-5 text-[#2D5A47]" />
              <h3 className="font-semibold text-[#262626]">Offer to Help</h3>
            </div>
            <button onClick={handleClose} className="p-1 hover:bg-[#F5F3EE] rounded text-[#525252]">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {success ? (
              <div className="flex flex-col items-center py-8">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <p className="mt-4 text-sm font-medium text-[#262626]">Thank you for offering to help!</p>
                <p className="text-xs text-[#525252] mt-1 text-center">
                  The community appreciates your willingness to contribute.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-[#525252] mb-4 line-clamp-2">{problemTitle}</p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2 text-[#262626]">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+232XXXXXXXX"
                      className="geist-input w-full"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2 text-[#262626]">
                      Message (Optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Let others know how you can help..."
                      className="geist-input w-full min-h-[100px] resize-none"
                      disabled={submitting}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <p className="text-xs">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full px-4 py-3 bg-[#2D5A47] text-white rounded-lg font-medium hover:bg-[#235242] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <HandHelping className="w-4 h-4 mr-2" />
                        Offer Help
                      </>
                    )}
                  </button>

                  {/* Show existing volunteers */}
                  {!loadingVolunteers && volunteers.length > 0 && (
                    <VolunteerList 
                      volunteers={volunteers} 
                      currentUserPhone={phoneNumber.trim()}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
