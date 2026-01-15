"use client";

import { useState } from "react";
import { Send, Sparkles, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export function AiChatbot() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col h-full bg-[var(--ds-sidebar-bg)] rounded-xl border border-[var(--ds-card-border)] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center justify-center pt-8 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <Compass className="w-6 h-6 text-[#15803D]" />
          <span className="text-xl font-bold text-[#15803D]">LayComplain</span>
          <Compass className="w-6 h-6 text-[#15803D]" />
        </div>
        
        <p className="text-[#304F44] text-lg font-medium">What can I help you with?</p>
      </div>

      {/* Chat Area (Spacer) */}
      <div className="flex-1 min-h-[100px]" />

      {/* Input Area */}
      <div className="p-6">
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything....."
            className="w-full h-12 pl-4 pr-12 text-sm bg-[#E8E6E1] border-none rounded-xl text-[#525252] placeholder-[#737373] focus:ring-0 focus:outline-none"
          />
          {/* Invisible send button to maintain layout or functional if needed */}
        </div>
      </div>
    </div>
  );
}
