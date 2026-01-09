"use client";

import Link from "next/link";
import { ArrowLeft, Video, Upload } from "lucide-react";
import { VideoGallery } from "@/app/components/video-gallery";

export default function GalleryPage() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--ds-background-100)] border-b border-[var(--ds-gray-300)]">
        <div className="max-w-screen-xl mx-auto px-3 md:px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-md hover:bg-[var(--ds-gray-200)] transition-colors">
              <ArrowLeft className="w-4 h-4 text-[var(--ds-gray-700)]" />
            </Link>
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-[var(--ds-purple-500)]" />
              <span className="font-semibold text-sm md:text-base">Video Gallery</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/videos"
              className="geist-button geist-button-secondary geist-text-small h-7 px-2 md:px-3"
            >
              <Upload className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Upload</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">Community Video Gallery</h1>
          <p className="geist-text-body text-sm md:text-base">
            Browse videos shared by community members. Watch, download, and engage with video content from your neighborhood.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="geist-card p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Video className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg">Share Videos</h3>
            <p className="text-sm text-gray-600 mt-1">
              Upload videos directly or send via WhatsApp
            </p>
          </div>

          <div className="geist-card p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg">Easy Upload</h3>
            <p className="text-sm text-gray-600 mt-1">
              Multiple formats supported up to 100MB
            </p>
          </div>

          <div className="geist-card p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <ArrowLeft className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg">Instant Access</h3>
            <p className="text-sm text-gray-600 mt-1">
              Watch and download videos anytime
            </p>
          </div>
        </div>

        {/* Video Gallery Component */}
        <VideoGallery />

        {/* Call to Action */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Share Your Story</h3>
            <p className="text-gray-600 mb-4">
              Have a video to share? Upload it to the community gallery or send it via WhatsApp!
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/videos"
                className="geist-button geist-button-primary"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Video
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
