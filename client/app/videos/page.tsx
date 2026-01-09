"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Share2, PlayCircle } from "lucide-react";
import { VideoUpload } from "@/app/components/video-upload";

interface VideoFile {
  file: File;
  url: string;
  id: string;
  name: string;
  size: number;
  duration?: number;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleVideosChange = (newVideos: VideoFile[]) => {
    setVideos(newVideos);
  };

  const uploadToServer = async () => {
    if (videos.length === 0) {
      alert("Please select at least one video to upload");
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      
      videos.forEach((video, index) => {
        formData.append(`videos`, video.file);
        formData.append(`videoNames`, video.name);
      });

      const response = await fetch("/api/videos/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Successfully uploaded ${result.uploadedCount} videos!`);
        setVideos([]);
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.message}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--ds-background-100)] border-b border-[var(--ds-gray-300)]">
        <div className="max-w-screen-xl mx-auto px-3 md:px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-md hover:bg-[var(--ds-gray-200)] transition-colors">
              <ArrowLeft className="w-4 h-4 text-[var(--ds-gray-700)]" />
            </Link>
            <div className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-[var(--ds-blue-500)]" />
              <span className="font-semibold text-sm md:text-base">Video Upload</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="geist-button geist-button-secondary geist-text-small h-7 px-2 md:px-3"
            >
              <Share2 className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">Share Your Videos</h1>
          <p className="geist-text-body text-sm md:text-base">
            Upload videos to share with the community. You can also send videos directly through WhatsApp for easy sharing.
          </p>
        </div>

        {/* Instructions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="geist-card p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Website Upload</h3>
                <p className="text-sm text-gray-600">
                  Upload videos directly through this page. Supports MP4, WebM, MOV, and AVI formats up to 100MB.
                </p>
              </div>
            </div>
          </div>

          <div className="geist-card p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Share2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium mb-1">WhatsApp Upload</h3>
                <p className="text-sm text-gray-600">
                  Send videos directly to our WhatsApp number for instant upload and sharing with the community.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Upload Component */}
        <VideoUpload
          onVideosChange={handleVideosChange}
          maxVideos={5}
          maxFileSize={100 * 1024 * 1024} // 100MB
        />

        {/* Upload Button */}
        {videos.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={uploadToServer}
              disabled={uploading}
              className="geist-button geist-button-primary px-8 py-3 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <div className="geist-spinner w-4 h-4 mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload {videos.length} Video{videos.length > 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        )}

        {/* WhatsApp Instructions */}
        <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold mb-3 text-green-800">
            📱 WhatsApp Video Upload
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Easy sharing:</strong> Simply send your videos to our WhatsApp number and they'll be automatically uploaded to the community platform.
            </p>
            <p>
              <strong>Instant processing:</strong> Videos are processed immediately and made available for community viewing and interaction.
            </p>
            <p>
              <strong>No size limits:</strong> WhatsApp handles large video files better than most web uploaders.
            </p>
          </div>
          <div className="mt-4 p-3 bg-white rounded border">
            <p className="text-xs text-gray-600 mb-1">Send videos to:</p>
            <p className="font-mono text-sm font-medium">+1 (555) 123-4567</p>
          </div>
        </div>
      </main>
    </>
  );
}
