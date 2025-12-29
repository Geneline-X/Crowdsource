import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all problems
    const allProblems = await prisma.problem.findMany({
      select: {
        status: true,
        reporterPhone: true,
        upvoteCount: true,
        updatedAt: true,
      },
    });

    // Calculate resolved this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const resolvedThisMonth = allProblems.filter(
      (p) => p.status === "RESOLVED" && new Date(p.updatedAt) >= startOfMonth
    ).length;

    // Calculate unique reporters (citizens engaged)
    const uniqueReporters = new Set(allProblems.map((p) => p.reporterPhone));
    const totalReporters = uniqueReporters.size;

    // Calculate total upvotes
    const totalUpvotes = allProblems.reduce((sum, p) => sum + p.upvoteCount, 0);

    // Calculate resolution rate
    const totalProblems = allProblems.length;
    const resolvedProblems = allProblems.filter((p) => p.status === "RESOLVED").length;
    const resolutionRate = totalProblems > 0 
      ? Math.round((resolvedProblems / totalProblems) * 100) 
      : 0;

    return NextResponse.json({
      resolvedThisMonth,
      totalReporters,
      totalUpvotes,
      resolutionRate,
    });
  } catch (error) {
    console.error("Failed to fetch impact stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch impact stats" },
      { status: 500 }
    );
  }
}
