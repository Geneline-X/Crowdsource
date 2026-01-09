import { create } from "zustand";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isOnline: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
  isInstallDismissed: boolean;
  setOnline: (online: boolean) => void;
  setInstallable: (installable: boolean) => void;
  setInstalled: (installed: boolean) => void;
  setInstallPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
  dismissInstall: () => void;
  triggerInstall: () => Promise<boolean>;
}

export const usePWAStore = create<PWAState>((set, get) => ({
  isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  isInstallable: false,
  isInstalled: false,
  installPrompt: null,
  isInstallDismissed: false,

  setOnline: (online) => set({ isOnline: online }),
  setInstallable: (installable) => set({ isInstallable: installable }),
  setInstalled: (installed) => set({ isInstalled: installed }),
  setInstallPrompt: (prompt) => set({ installPrompt: prompt, isInstallable: !!prompt }),

  dismissInstall: () => {
    set({ isInstallDismissed: true });
    // Remember dismissal in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("pwa-install-dismissed", "true");
    }
  },

  triggerInstall: async () => {
    const { installPrompt } = get();
    if (!installPrompt) return false;

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      if (outcome === "accepted") {
        set({ isInstalled: true, installPrompt: null, isInstallable: false });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
}));

// Check if install was previously dismissed
export function checkInstallDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("pwa-install-dismissed") === "true";
}
