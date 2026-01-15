"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Sidebar } from "@/app/components/sidebar";
import { ProblemsClient } from "@/app/components/problems-client";
import { Problem } from "@/lib/types";

// Dynamically import existing pages
const AnalyticsPage = dynamic(() => import("@/app/analytics/page"), { 
  loading: () => <div className="flex-1 flex items-center justify-center"><div className="text-[#525252]">Loading...</div></div>
});
const LeaderboardPage = dynamic(() => import("@/app/leaderboard/page"), { 
  loading: () => <div className="flex-1 flex items-center justify-center"><div className="text-[#525252]">Loading...</div></div>
});
const BlogPage = dynamic(() => import("@/app/weekly-blog/page"), { 
  loading: () => <div className="flex-1 flex items-center justify-center"><div className="text-[#525252]">Loading...</div></div>
});

interface MainAppWrapperProps {
  initialProblems: Problem[];
}

export function MainAppWrapper({ initialProblems }: MainAppWrapperProps) {
  const [activePage, setActivePage] = useState("/");

  const handleNavigate = (page: string) => {
    setActivePage(page);
  };

  const renderContent = () => {
    switch (activePage) {
      case "/":
        return <ProblemsClient initialProblems={initialProblems} />;
      case "/analytics":
        return <AnalyticsPage />;
      case "/leaderboard":
        return <LeaderboardPage />;
      case "/weekly-blog":
        return <BlogPage />;
      default:
        return <ProblemsClient initialProblems={initialProblems} />;
    }
  };

  return (
    <div className="main-layout">
      {/* Sidebar Navigation */}
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
}

