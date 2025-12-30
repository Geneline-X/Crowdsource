import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/problems/[id]/rate - Submit a resolution quality rating
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const problemId = parseInt(id);

    const body = await request.json();
    const { rating, comment, raterPhone, fingerprint } = body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (!fingerprint) {
      return NextResponse.json(
        { error: "Fingerprint required" },
        { status: 400 }
      );
    }

    // Check if problem exists and is resolved
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        upvotes: true,
        ratings: true,
      },
    });

    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }

    if (problem.status !== "RESOLVED") {
      return NextResponse.json(
        { error: "Can only rate resolved problems" },
        { status: 400 }
      );
    }

    // Check if user upvoted this problem
    // Note: We allow any upvoter to rate since we track ratings by fingerprint
    if (problem.upvotes.length === 0) {
      return NextResponse.json(
        { error: "Only upvoters can rate resolutions" },
        { status: 403 }
      );
    }

    // Check if already rated
    const hasRated = problem.ratings.some(
      (rating) => rating.raterFingerprint === fingerprint
    );

    if (hasRated) {
      return NextResponse.json(
        { error: "You have already rated this resolution" },
        { status: 400 }
      );
    }

    // Create rating
    const newRating = await prisma.resolutionRating.create({
      data: {
        problemId,
        raterPhone: raterPhone || "anonymous",
        raterFingerprint: fingerprint,
        rating,
        comment: comment || null,
      },
    });

    // Calculate new average rating
    const allRatings = await prisma.resolutionRating.findMany({
      where: { problemId },
      select: { rating: true },
    });

    const total = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const average = total / allRatings.length;

    // Update problem with new rating stats
    await prisma.problem.update({
      where: { id: problemId },
      data: {
        averageRating: average,
        ratingCount: allRatings.length,
      },
    });

    return NextResponse.json({
      success: true,
      rating: newRating,
      averageRating: average,
      ratingCount: allRatings.length,
    });
  } catch (error: any) {
    console.error("Error submitting rating:", error);
    return NextResponse.json(
      { error: "Failed to submit rating", details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/problems/[id]/rate - Get ratings for a problem
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const problemId = parseInt(id);

    const ratings = await prisma.resolutionRating.findMany({
      where: { problemId },
      orderBy: { createdAt: "desc" },
    });

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      select: {
        averageRating: true,
        ratingCount: true,
      },
    });

    return NextResponse.json({
      ratings,
      averageRating: problem?.averageRating || 0,
      ratingCount: problem?.ratingCount || 0,
    });
  } catch (error: any) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}
