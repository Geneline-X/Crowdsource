"use client";

import { User, Clock } from "lucide-react";

interface Volunteer {
  userPhone: string;
  createdAt: string;
}

interface VolunteerListProps {
  volunteers: Volunteer[];
  currentUserPhone?: string;
}

export function VolunteerList({ volunteers, currentUserPhone }: VolunteerListProps) {
  if (volunteers.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-3 border border-[var(--ds-gray-400)] rounded-lg bg-[var(--ds-background-100)]">
      <div className="flex items-center gap-2 mb-2">
        <User className="w-4 h-4 text-[var(--ds-gray-700)]" />
        <h4 className="text-sm font-medium">
          {volunteers.length} Volunteer{volunteers.length === 1 ? "" : "s"} Offered to Help
        </h4>
      </div>

      <p className="text-xs text-[var(--ds-gray-600)] mb-3">
        Consider coordinating together for a bigger impact! 🤝
      </p>

      <div className="space-y-2">
        {volunteers.map((volunteer, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 px-3 border border-[var(--ds-gray-300)] rounded-md bg-[var(--ds-background-100)]"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[var(--ds-gray-200)] flex items-center justify-center">
                <User className="w-3 h-3 text-[var(--ds-gray-700)]" />
              </div>
              <div>
                <p className="text-xs font-medium">
                  {volunteer.userPhone === currentUserPhone ? (
                    <span className="text-[var(--ds-blue-600)]">You</span>
                  ) : (
                    <span>Community Member</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-[var(--ds-gray-600)]">
              <Clock className="w-3 h-3" />
              <span>{new Date(volunteer.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 px-3 py-2 bg-[var(--ds-gray-100)] rounded-md text-xs text-[var(--ds-gray-700)]">
        💡 <strong>Tip:</strong> Working together makes fixing problems easier and faster!
      </div>
    </div>
  );
}
