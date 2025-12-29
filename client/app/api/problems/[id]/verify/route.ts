import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VERIFICATION_THRESHOLD = 3; // Number of verifications needed

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const problemId = parseInt(id, 10);
    
    if (isNaN(problemId)) {
      return NextResponse.json(
        { error: "Invalid problem ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { fingerprint, latitude, longitude, imageUrls } = body;

    // Validate required fields
    if (!fingerprint || typeof latitude !== "number" || typeof longitude !== "number") {
      return NextResponse.json(
        { error: "Missing required fields: fingerprint, latitude, longitude" },
        { status: 400 }
      );
    }

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    // Check if problem exists
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return NextResponse.json(
        { error: "Problem not found" },
        { status: 404 }
      );
    }

    // Check if this device already verified this problem
    const existingVerification = await prisma.problemVerification.findUnique({
      where: {
        problemId_fingerprint: {
          problemId,
          fingerprint,
        },
      },
    });

    if (existingVerification) {
      return NextResponse.json(
        { error: "You have already verified this problem" },
        { status: 409 }
      );
    }

    // Create verification
    const verification = await prisma.problemVerification.create({
      data: {
        problemId,
        fingerprint,
        latitude,
        longitude,
        imageUrls,
      },
    });

    // Get updated count
    const verificationCount = await prisma.problemVerification.count({
      where: { problemId },
    });

    // Update problem verification count and status
    const updateData: { verificationCount: number; locationVerified?: boolean } = {
      verificationCount,
    };

    // If threshold reached, mark as verified
    if (verificationCount >= VERIFICATION_THRESHOLD) {
      updateData.locationVerified = true;
    }

    await prisma.problem.update({
      where: { id: problemId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      verification: {
        id: verification.id,
        createdAt: verification.createdAt,
      },
      verificationCount,
      isVerified: verificationCount >= VERIFICATION_THRESHOLD,
      threshold: VERIFICATION_THRESHOLD,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to submit verification" },
      { status: 500 }
    );
  }
}

// GET - Check verification status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const problemId = parseInt(id, 10);
    
    if (isNaN(problemId)) {
      return NextResponse.json(
        { error: "Invalid problem ID" },
        { status: 400 }
      );
    }

    // Check fingerprint from query
    const fingerprint = request.nextUrl.searchParams.get("fingerprint");

    const verificationCount = await prisma.problemVerification.count({
      where: { problemId },
    });

    let hasVerified = false;
    if (fingerprint) {
      const existing = await prisma.problemVerification.findUnique({
        where: {
          problemId_fingerprint: {
            problemId,
            fingerprint,
          },
        },
      });
      hasVerified = !!existing;
    }

    return NextResponse.json({
      verificationCount,
      hasVerified,
      isVerified: verificationCount >= VERIFICATION_THRESHOLD,
      threshold: VERIFICATION_THRESHOLD,
    });
  } catch (error) {
    console.error("Error checking verification:", error);
    return NextResponse.json(
      { error: "Failed to check verification status" },
      { status: 500 }
    );
  }
}
