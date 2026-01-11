import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProblemsClient } from "@/app/components/problems-client";
import { BarChart3, Trophy, Newspaper, MapPin, Activity, TrendingUp, Users, CheckCircle } from "lucide-react";
import { Problem } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getProblems() {
  try {
    const problems = await prisma.problem.findMany({
      orderBy: { upvoteCount: "desc" },
      include: {
        images: {
          select: {
            id: true,
            url: true,
            mimeType: true,
            size: true,
            createdAt: true
          }
        },
        media: {
          select: {
            id: true,
            url: true,
            mimeType: true,
            size: true,
            createdAt: true
          }
        }
      },
    });
    return JSON.parse(JSON.stringify(problems)) as Problem[];
  } catch (error) {
    console.error("Failed to fetch problems:", error);
    return [] as Problem[];
  }
}

export default async function HomePage() {
  const problems = await getProblems();
  const geolocatedCount = problems.filter(p => p.latitude && p.longitude).length;
  const totalVotes = problems.reduce((s, p) => s + p.upvoteCount, 0);
  const resolvedCount = problems.filter(p => p.status === "RESOLVED").length;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Compact Premium Header */}
      <header className="header-glass shrink-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
          <div className="h-14 flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20 transition-transform group-hover:scale-105">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-base tracking-tight hidden sm:block">Crowdsource</span>
              </Link>
              
              {/* Live Indicator */}
              <div className="live-indicator">
                <div className="live-indicator-dot" />
                <span className="text-xs font-medium text-green-400">Live</span>
              </div>
            </div>

            {/* Inline Stats - Desktop */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span className="font-semibold text-white">{problems.length}</span>
                <span className="text-gray-500">Active</span>
              </div>
              <div className="w-px h-5 bg-gray-800" />
              <div className="flex items-center gap-2 text-sm">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="font-semibold text-white">{geolocatedCount}</span>
                <span className="text-gray-500">Mapped</span>
              </div>
              <div className="w-px h-5 bg-gray-800" />
              <div className="flex items-center gap-2 text-sm">
                <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <span className="font-semibold text-white">{totalVotes}</span>
                <span className="text-gray-500">Votes</span>
              </div>
              <div className="w-px h-5 bg-gray-800" />
              <div className="flex items-center gap-2 text-sm">
                <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                </div>
                <span className="font-semibold text-white">{resolvedCount}</span>
                <span className="text-gray-500">Resolved</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/" className="header-nav-item active">
                Home
              </Link>
              <Link href="/analytics" className="header-nav-item flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                Analytics
              </Link>
              <Link href="/leaderboard" className="header-nav-item flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                Leaderboard
              </Link>
              <Link href="/weekly-blog" className="header-nav-item flex items-center gap-1.5">
                <Newspaper className="w-3.5 h-3.5" />
                Blog
              </Link>
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 mr-2">
                <span className="text-xs font-semibold text-white">{problems.length}</span>
                <span className="text-xs text-gray-500">issues</span>
              </div>
              <Link href="/analytics" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <BarChart3 className="w-4.5 h-4.5 text-gray-400" />
              </Link>
              <Link href="/leaderboard" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Trophy className="w-4.5 h-4.5 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Height Main Content */}
      <main className="flex-1 overflow-hidden pt-4">
        <ProblemsClient initialProblems={problems} />
      </main>
    </div>
  );
}
