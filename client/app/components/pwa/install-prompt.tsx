"use client";

import { useEffect } from "react";
import { Download, X } from "lucide-react";
import { usePWAStore, checkInstallDismissed } from "@/lib/stores/pwa-store";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPrompt() {
  const {
    isInstallable,
    isInstalled,
    isInstallDismissed,
    setInstallPrompt,
    setInstalled,
    setOnline,
    dismissInstall,
    triggerInstall,
  } = usePWAStore();

  useEffect(() => {
    // Check if already dismissed
    if (checkInstallDismissed()) {
      dismissInstall();
    }

    // Check if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    // Listen for online/offline changes
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setInstallPrompt, setInstalled, setOnline, dismissInstall]);

  // Don't show if not installable, already installed, or dismissed
  if (!isInstallable || isInstalled || isInstallDismissed) {
    return null;
  }

  const handleInstall = async () => {
    await triggerInstall();
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[var(--ds-gray-100)] border border-[var(--ds-gray-400)] rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[var(--ds-gray-200)] rounded-lg">
            <Download className="w-5 h-5 text-[var(--ds-gray-1000)]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm text-[var(--ds-gray-1000)]">
              Install Crowdsource
            </h3>
            <p className="text-xs text-[var(--ds-gray-900)] mt-0.5">
              Get offline access and a faster experience
            </p>
          </div>
          <button
            onClick={dismissInstall}
            className="p-1 hover:bg-[var(--ds-gray-200)] rounded transition-colors"
            aria-label="Dismiss install prompt"
          >
            <X className="w-4 h-4 text-[var(--ds-gray-700)]" />
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={dismissInstall}
            className="flex-1 px-3 py-2 text-sm font-medium text-[var(--ds-gray-900)] hover:bg-[var(--ds-gray-200)] rounded-md transition-colors"
          >
            Not now
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 px-3 py-2 text-sm font-medium bg-[var(--ds-gray-1000)] text-[var(--ds-gray-100)] hover:bg-[var(--ds-gray-900)] rounded-md transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
