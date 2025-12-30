"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, HandHelping, Loader2, Check, AlertCircle } from "lucide-react";

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
        className="fixed inset-0 z-50 geist-overlay flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="geist-modal w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--ds-gray-400)]">
            <div className="flex items-center gap-2">
              <HandHelping className="w-5 h-5 text-[var(--ds-blue-500)]" />
              <h3 className="font-semibold">Offer to Help</h3>
            </div>
            <button onClick={handleClose} className="p-1 hover:bg-[var(--ds-gray-200)] rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {success ? (
              <div className="flex flex-col items-center py-8">
                <div className="w-12 h-12 rounded-full bg-[var(--ds-green-100)] flex items-center justify-center">
                  <Check className="w-6 h-6 text-[var(--ds-green-600)]" />
                </div>
                <p className="mt-4 text-sm font-medium">Thank you for offering to help!</p>
                <p className="text-xs text-[var(--ds-gray-600)] mt-1 text-center">
                  The community appreciates your willingness to contribute.
                </p>
              </div>
            ) : (
              <>
                <p className="geist-text-small mb-4 line-clamp-2">{problemTitle}</p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Phone Number <span className="text-[var(--ds-red-500)]">*</span>
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
                    <label className="text-sm font-medium block mb-2">
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
                    <div className="flex items-center gap-2 text-[var(--ds-red-600)] bg-[var(--ds-red-100)] p-3 rounded-md">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <p className="text-xs">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="geist-button geist-button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
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
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
