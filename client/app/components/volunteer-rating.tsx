"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface Rating {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface VolunteerRatingProps {
  problemId: number;
  averageRating?: number;
  ratingCount?: number;
  ratings?: Rating[];
  canRate: boolean;
  fingerprint: string;
  onRatingSubmitted?: () => void;
}

export function VolunteerRating({
  problemId,
  averageRating = 0,
  ratingCount = 0,
  ratings = [],
  canRate,
  fingerprint,
  onRatingSubmitted,
}: VolunteerRatingProps) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      setError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/problems/${problemId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: selectedRating,
          comment: comment.trim() || undefined,
          raterPhone: undefined, // Anonymous
          fingerprint,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit rating");
      }

      setSuccess(true);
      setSelectedRating(0);
      setComment("");
      
      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Average Rating Display */}
      {ratingCount > 0 && (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-2xl font-bold">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Based on {ratingCount} {ratingCount === 1 ? "rating" : "ratings"}
          </p>
        </div>
      )}

      {/* Rating Form */}
      {canRate && !success && (
        <div className="p-4 border border-gray-300 rounded-lg">
          <h4 className="font-semibold mb-3">Rate this resolution:</h4>

          {/* Star Rating Input */}
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setSelectedRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || selectedRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Comment Input */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts (optional)"
            className="w-full p-2 border border-gray-300 rounded-lg resize-none h-20 text-sm"
            maxLength={500}
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedRating === 0}
            className="geist-button geist-button-primary w-full mt-3 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </button>

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-300 rounded-lg">
          <p className="text-green-800 font-medium">
            ✅ Thank you for rating this resolution!
          </p>
        </div>
      )}

      {!canRate && ratingCount === 0 && (
        <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-600 text-sm">
          Only upvoters can rate resolutions
        </div>
      )}

      {/* Individual Ratings */}
      {ratings.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Community Feedback:</h4>
          {ratings.map((rating) => (
            <div
              key={rating.id}
              className="p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= rating.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(rating.createdAt).toLocaleDateString()}
                </span>
              </div>
              {rating.comment && (
                <p className="text-sm text-gray-700">{rating.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
