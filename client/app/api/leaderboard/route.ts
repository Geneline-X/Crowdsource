import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Mask phone number for privacy (keep last 4 digits)
function maskPhone(phone: string): string {
  if (phone.length <= 4) return phone;
  const lastFour = phone.slice(-4);
  const masked = "X".repeat(phone.length - 4);
  return `${masked}${lastFour}`;
}

// Calculate total score for ranking
function calculateScore(stats: {
  problemsReported: number;
  upvotesGiven: number;
  verificationsGiven: number;
  responsesOffered: number;
}): number {
  return (
    stats.problemsReported * 10 +
    stats.upvotesGiven * 1 +
    stats.verificationsGiven * 5 +
    stats.responsesOffered * 3
  );
}

// Determine badge based on total contributions
function getBadge(totalContributions: number): {
  name: string;
  icon: string;
  color: string;
} {
  if (totalContributions >= 50)
    return { name: "Super Hero", icon: "trophy", color: "#f59e0b" };
  if (totalContributions >= 25)
    return { name: "Civic Champion", icon: "crown", color: "#8b5cf6" };
  if (totalContributions >= 10)
    return { name: "Community Leader", icon: "star", color: "#14b8a6" };
  if (totalContributions >= 5)
    return { name: "Active Citizen", icon: "award", color: "#0091ff" };
  if (totalContributions >= 1)
    return { name: "Novice Reporter", icon: "shield", color: "#30a46c" };
  return { name: "New Member", icon: "user", color: "#6b7280" };
}

export async function GET() {
  try {
    const stats = await prisma.userStats.findMany({
      where: {
        displayInLeaderboard: true,
      },
      orderBy: [
        { problemsReported: "desc" },
        { verificationsGiven: "desc" },
        { upvotesGiven: "desc" },
      ],
      take: 50,
    });

    const leaderboard = stats.map((user, index) => {
      const totalContributions =
        user.problemsReported +
        user.upvotesGiven +
        user.verificationsGiven +
        user.responsesOffered;

      return {
        rank: index + 1,
        userPhone: maskPhone(user.userPhone),
        problemsReported: user.problemsReported,
        upvotesGiven: user.upvotesGiven,
        verificationsGiven: user.verificationsGiven,
        responsesOffered: user.responsesOffered,
        totalContributions,
        score: calculateScore(user),
        badge: getBadge(totalContributions),
      };
    });

    return NextResponse.json({ success: true, leaderboard });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
