"use client";

import { CheckCircle, MessageSquare, ShieldCheck, HandHelping, Flag } from "lucide-react";

interface TimelineEvent {
  id: number;
  eventType: string;
  actorPhone?: string;
  metadata?: any;
  createdAt: string;
}

interface ResolutionTimelineProps {
  events: TimelineEvent[];
}

const eventConfig: Record<string, { icon: any; color: string; label: string }> = {
  REPORTED: {
    icon: Flag,
    color: "text-blue-500",
    label: "Problem Reported",
  },
  UPVOTED: {
    icon: MessageSquare,
    color: "text-purple-500",
    label: "Community Upvoted",
  },
  VERIFIED: {
    icon: ShieldCheck,
    color: "text-green-500",
    label: "Location Verified",
  },
  HELP_OFFERED: {
    icon: HandHelping,
    color: "text-orange-500",
    label: "Help Offered",
  },
  RESOLVED: {
    icon: CheckCircle,
    color: "text-green-600",
    label: "Problem Resolved",
  },
};

export function ResolutionTimeline({ events }: ResolutionTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No timeline events available
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

      {/* Events */}
      <div className="space-y-6">
        {events.map((event, index) => {
          const config = eventConfig[event.eventType] || {
            icon: MessageSquare,
            color: "text-gray-500",
            label: event.eventType,
          };
          const Icon = config.icon;

          return (
            <div key={event.id} className="relative flex gap-4">
              {/* Icon */}
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 ${
                  index === events.length - 1
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              >
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{config.label}</h4>
                  <span className="text-xs text-gray-500">
                    {new Date(event.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {event.actorPhone && (
                  <p className="text-xs text-gray-600 mt-1">
                    By community member
                  </p>
                )}

                {event.metadata && Object.keys(event.metadata).length > 0 && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    {JSON.stringify(event.metadata, null, 2)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
