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
