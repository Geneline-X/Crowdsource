"use client";

import { useEffect, useState } from "react";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";
import { usePWAStore } from "@/lib/stores/pwa-store";

export function OfflineIndicator() {
  const { isOnline, setOnline } = usePWAStore();
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      if (wasOffline) {
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 3000);
      }
    };

    const handleOffline = () => {
      setOnline(false);
      setWasOffline(true);
    };

    // Set initial state
    setOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnline, wasOffline]);

  // Show reconnected message briefly
  if (showReconnected) {
    return (
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full shadow-lg">
          <Wifi className="w-4 h-4" />
          <span className="text-sm font-medium">Back online</span>
        </div>
      </div>
    );
  }

  // Show offline indicator
  if (!isOnline) {
    return (
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full shadow-lg">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">You&apos;re offline</span>
          <button
            onClick={() => window.location.reload()}
            className="p-1 hover:bg-amber-500/20 rounded-full transition-colors"
            aria-label="Retry connection"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
