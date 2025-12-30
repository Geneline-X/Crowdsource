import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/problems/[id]/timeline - Get timeline events for a problem
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const problemId = parseInt(id);

    const events = await prisma.problemTimelineEvent.findMany({
      where: { problemId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      events,
    });
  } catch (error: any) {
    console.error("Error fetching timeline:", error);
    return NextResponse.json(
      { error: "Failed to fetch timeline" },
      { status: 500 }
    );
  }
}
