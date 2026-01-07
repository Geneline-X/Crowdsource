"use client";

import { useState, useEffect } from "react";
import { Play, Download, Calendar, FileVideo, User, Eye } from "lucide-react";

interface Video {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
  problem?: {
    id: string;
    title: string;
    description: string;
  };
}

interface VideoGalleryProps {
  refreshTrigger?: number;
}

export function VideoGallery({ refreshTrigger = 0 }: VideoGalleryProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/videos");
      const data = await response.json();
      
      if (data.success) {
        setVideos(data.videos);
      } else {
        setError("Failed to load videos");
      }
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [refreshTrigger]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadVideo = (video: Video) => {
    const a = document.createElement('a');
    a.href = video.url;
    a.download = video.originalName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="geist-spinner w-6 h-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="geist-card p-6 border-[var(--ds-red-400)] text-center">
        <p className="text-[var(--ds-red-600)]">{error}</p>
        <button onClick={fetchVideos} className="geist-button geist-button-secondary mt-4">
          Retry
        </button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="geist-card p-8 text-center">
        <FileVideo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No videos yet</h3>
        <p className="text-gray-600 mb-4">
          Be the first to share a video with the community!
        </p>
        <a href="/videos" className="geist-button geist-button-primary">
          Upload a Video
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          Community Videos ({videos.length})
        </h2>
        <button
          onClick={fetchVideos}
          className="geist-button geist-button-secondary h-8 px-2"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onSelect={() => setSelectedVideo(video)}
            onDownload={() => downloadVideo(video)}
          />
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}

interface VideoCardProps {
  video: Video;
  onSelect: () => void;
  onDownload: () => void;
}

function VideoCard({ video, onSelect, onDownload }: VideoCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="geist-card overflow-hidden group cursor-pointer" onClick={onSelect}>
      {/* Video Thumbnail */}
      <div className="relative aspect-video bg-black overflow-hidden">
        <video
          className="w-full h-full object-cover"
          src={video.url}
          onMouseEnter={(e) => {
            const videoElement = e.target as HTMLVideoElement;
            videoElement.play().catch(() => {});
          }}
          onMouseLeave={(e) => {
            const videoElement = e.target as HTMLVideoElement;
            videoElement.pause();
            videoElement.currentTime = 0;
          }}
          muted
          loop
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
          <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          Video
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="font-medium text-sm mb-2 line-clamp-2">
          {video.originalName}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span>{formatFileSize(video.size)}</span>
          <span>•</span>
          <span>{formatDate(video.uploadedAt)}</span>
        </div>

        {video.problem && (
          <div className="text-xs text-blue-600 mb-3">
            Related to: {video.problem.title}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Download video"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Eye className="w-3 h-3" />
            <span>View</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface VideoModalProps {
  video: Video;
  onClose: () => void;
}

function VideoModal({ video, onClose }: VideoModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-semibold">{video.originalName}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span>{formatFileSize(video.size)}</span>
              <span>{formatDate(video.uploadedAt)}</span>
              <span>{video.mimeType}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Video Player */}
        <div className="aspect-video bg-black">
          <video
            className="w-full h-full"
            src={video.url}
            controls
            autoPlay
          />
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {video.problem && (
              <span>Related to: <strong>{video.problem.title}</strong></span>
            )}
          </div>
          <button
            onClick={() => {
              const a = document.createElement('a');
              a.href = video.url;
              a.download = video.originalName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
            className="geist-button geist-button-secondary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
