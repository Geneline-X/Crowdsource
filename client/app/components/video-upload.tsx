"use client";

import { useState, useRef } from "react";
import { Upload, X, Play, Pause, Volume2, VolumeX, Maximize2, Download } from "lucide-react";

interface VideoFile {
  file: File;
  url: string;
  id: string;
  name: string;
  size: number;
  duration?: number;
}

interface VideoUploadProps {
  onVideosChange?: (videos: VideoFile[]) => void;
  maxVideos?: number;
  maxFileSize?: number; // in bytes
  acceptedFormats?: string[];
}

export function VideoUpload({
  onVideosChange,
  maxVideos = 5,
  maxFileSize = 100 * 1024 * 1024, // 100MB default
  acceptedFormats = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
}: VideoUploadProps) {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => resolve(0);
      video.src = URL.createObjectURL(file);
    });
  };

  const processFiles = async (files: FileList) => {
    const validFiles = Array.from(files).filter(file => {
      if (!acceptedFormats.includes(file.type)) {
        alert(`File ${file.name} is not a supported video format`);
        return false;
      }
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of ${formatFileSize(maxFileSize)}`);
        return false;
      }
      return true;
    });

    if (videos.length + validFiles.length > maxVideos) {
      alert(`You can only upload a maximum of ${maxVideos} videos`);
      return;
    }

    setUploading(true);
    const newVideos: VideoFile[] = [];

    for (const file of validFiles) {
      const duration = await getVideoDuration(file);
      const videoFile: VideoFile = {
        file,
        url: URL.createObjectURL(file),
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        duration
      };
      newVideos.push(videoFile);
    }

    const updatedVideos = [...videos, ...newVideos];
    setVideos(updatedVideos);
    onVideosChange?.(updatedVideos);
    setUploading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeVideo = (id: string) => {
    const videoToRemove = videos.find(v => v.id === id);
    if (videoToRemove) {
      URL.revokeObjectURL(videoToRemove.url);
    }
    const updatedVideos = videos.filter(v => v.id !== id);
    setVideos(updatedVideos);
    onVideosChange?.(updatedVideos);
  };

  const clearAll = () => {
    videos.forEach(video => URL.revokeObjectURL(video.url));
    setVideos([]);
    onVideosChange?.([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Upload Videos</h2>
        <p className="text-gray-600">
          Share videos through the website or WhatsApp. Maximum {formatFileSize(maxFileSize)} per file, up to {maxVideos} videos.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <Upload className="w-12 h-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium">Drop videos here or click to browse</p>
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: MP4, WebM, MOV, AVI
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || videos.length >= maxVideos}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Processing...' : 'Select Videos'}
          </button>
        </div>
      </div>

      {/* Video List */}
      {videos.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Uploaded Videos ({videos.length})</h3>
            <button
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-4">
            {videos.map((video) => (
              <VideoPlayer
                key={video.id}
                video={video}
                onRemove={() => removeVideo(video.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface VideoPlayerProps {
  video: VideoFile;
  onRemove: () => void;
}

function VideoPlayer({ video, onRemove }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const downloadVideo = () => {
    const a = document.createElement('a');
    a.href = video.url;
    a.download = video.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div ref={containerRef} className="bg-white border rounded-lg overflow-hidden shadow-sm">
      <div className="relative">
        <video
          ref={videoRef}
          src={video.url}
          className="w-full h-auto max-h-96 object-contain bg-black"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center space-x-3 text-white">
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            <button
              onClick={toggleMute}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, white ${progress}%, rgba(255,255,255,0.3) ${progress}%)`
                }}
              />
            </div>
            
            <span className="text-sm">
              {formatDuration(currentTime)} / {formatDuration(duration || video.duration || 0)}
            </span>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            
            <button
              onClick={downloadVideo}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Video Info */}
      <div className="p-4 border-t">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{video.name}</h4>
            <p className="text-sm text-gray-500">
              {formatFileSize(video.size)}
              {video.duration && ` • ${formatDuration(video.duration)}`}
            </p>
          </div>
          <button
            onClick={onRemove}
            className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
