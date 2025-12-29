import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProblemsClient } from "@/app/components/problems-client";
import { ImpactBanner } from "@/app/components/impact-banner";

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
    // Serialize Date objects to strings for client component
    return JSON.parse(JSON.stringify(problems));
  } catch (error) {
    console.error("Failed to fetch problems:", error);
    return [];
  }
}

export default async function HomePage() {
  const problems = await getProblems();

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--ds-background-100)] border-b border-[var(--ds-gray-300)]">
        <div className="max-w-screen-xl mx-auto px-3 md:px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-6 h-6 rounded bg-[var(--ds-gray-1000)]" />
            <span className="font-semibold text-sm md:text-base">Crowdsource</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="geist-text-small text-[var(--ds-gray-600)] hidden sm:inline">Live</span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="geist-text-small hidden md:inline">{problems.length} issues reported</span>
            <Link
              href="/analytics"
              className="geist-button geist-button-secondary geist-text-small h-7 px-2 md:px-3"
            >
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </Link>
            <Link
              href="/weekly-blog"
              className="geist-button geist-button-secondary geist-text-small h-7 px-2 md:px-3"
            >
              <span className="hidden sm:inline">Weekly blog</span>
              <span className="sm:hidden">Blog</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">Community Issues</h1>
          <p className="geist-text-body text-sm md:text-base">
            Problems reported by community members. Vote on issues that matter to you.
          </p>
        </div>

        {/* Impact Metrics Banner */}
        <ImpactBanner />

        <ProblemsClient initialProblems={problems} />
      </main>
    </>
  );
}

