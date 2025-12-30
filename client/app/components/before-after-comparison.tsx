"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BeforeAfterComparisonProps {
  beforeImages: string[];
  afterImages: string[];
}

export function BeforeAfterComparison({
  beforeImages,
  afterImages,
}: BeforeAfterComparisonProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [viewMode, setViewMode] = useState<"slider" | "side-by-side">("slider");

  const maxIndex = Math.max(beforeImages.length, afterImages.length) - 1;

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentBefore = beforeImages[currentIndex];
  const currentAfter = afterImages[currentIndex];

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode("slider")}
          className={`px-3 py-1 rounded text-sm ${
            viewMode === "slider"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Slider View
        </button>
        <button
          onClick={() => setViewMode("side-by-side")}
          className={`px-3 py-1 rounded text-sm ${
            viewMode === "side-by-side"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Side by Side
        </button>
      </div>

      {viewMode === "slider" ? (
        /* Slider Mode */
        <div className="relative w-full h-[400px] overflow-hidden rounded-lg bg-gray-100">
          {currentBefore && (
            <div className="absolute inset-0">
              <Image
                src={currentBefore}
                alt="Before"
                fill
                className="object-contain"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                Before
              </div>
            </div>
          )}

          {currentAfter && (
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <Image
                src={currentAfter}
                alt="After"
                fill
                className="object-contain"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                After
              </div>
            </div>
          )}

          {/* Slider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={(e) => {
              const handleMouseMove = (moveEvent: MouseEvent) => {
                const rect = e.currentTarget.parentElement!.getBoundingClientRect();
                const x = moveEvent.clientX - rect.left;
                const percentage = (x / rect.width) * 100;
                setSliderPosition(Math.max(0, Math.min(100, percentage)));
              };

              const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
              };

              document.addEventListener("mousemove", handleMouseMove);
              document.addEventListener("mouseup", handleMouseUp);
            }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              <ChevronLeft className="w-3 h-3 absolute left-0.5" />
              <ChevronRight className="w-3 h-3 absolute right-0.5" />
            </div>
          </div>
        </div>
      ) : (
        /* Side by Side Mode */
        <div className="grid grid-cols-2 gap-4">
          {currentBefore && (
            <div className="relative h-[400px] rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={currentBefore}
                alt="Before"
                fill
                className="object-contain"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                Before
              </div>
            </div>
          )}
          {currentAfter && (
            <div className="relative h-[400px] rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={currentAfter}
                alt="After"
                fill
                className="object-contain"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                After
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      {maxIndex > 0 && (
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="geist-button geist-button-secondary disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {maxIndex + 1}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
            className="geist-button geist-button-secondary disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
