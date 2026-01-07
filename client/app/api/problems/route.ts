import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const problems = await prisma.problem.findMany({
      orderBy: { upvoteCount: "desc" },
      include: {
        _count: {
          select: { upvotes: true },
        },
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
        },
        videos: {
          select: {
            id: true,
            filename: true,
            originalName: true,
            mimeType: true,
            size: true,
            url: true,
            uploadedAt: true
          }
        },
        verifications: {
          select: {
            id: true,
            latitude: true,
            longitude: true,
            imageUrls: true,
            createdAt: true,
            fingerprint: true
          }
        }
      },
    });

    return NextResponse.json(problems || []);
  } catch (error) {
    console.error("Failed to fetch problems:", error);
    return NextResponse.json(
      { error: "Failed to fetch problems" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, locationText, category, reporterPhone, latitude, longitude, videoId } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const problem = await prisma.problem.create({
      data: {
        title,
        rawMessage: description,
        locationText: locationText || null,
        reporterPhone: reporterPhone || "anonymous",
        locationSource: category || null,
        upvoteCount: 0,
        locationVerified: !!(latitude && longitude),
        latitude: latitude || null,
        longitude: longitude || null,
        // If videoId is provided, link the video to this problem
        ...(videoId && {
          videos: {
            connect: { id: videoId }
          }
        })
      },
      include: {
        images: true,
        media: true,
        videos: true,
      },
    });

    return NextResponse.json(problem, { status: 201 });
  } catch (error) {
    console.error("Failed to create problem:", error);
    return NextResponse.json(
      { error: "Failed to create problem" },
      { status: 500 }
    );
  }
}
