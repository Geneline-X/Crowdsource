import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const problemId = parseInt(id, 10);

    if (isNaN(problemId)) {
      return NextResponse.json({ error: "Invalid problem ID" }, { status: 400 });
    }

    const body = await request.json();
    const voterPhone = body.voterPhone;

    if (!voterPhone || typeof voterPhone !== "string") {
      return NextResponse.json(
        { error: "voterPhone is required" },
        { status: 400 }
      );
    }

    const existingVote = await prisma.problemUpvote.findUnique({
      where: {
        problemId_voterPhone: {
          problemId,
          voterPhone,
        },
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "Already voted" },
        { status: 409 }
      );
    }

    await prisma.$transaction([
      prisma.problemUpvote.create({
        data: {
          problemId,
          voterPhone,
        },
      }),
      prisma.problem.update({
        where: { id: problemId },
        data: { upvoteCount: { increment: 1 } },
      }),
    ]);

    const updatedProblem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    return NextResponse.json(updatedProblem);
  } catch (error) {
    console.error("Failed to upvote problem:", error);
    return NextResponse.json(
      { error: "Failed to upvote problem" },
      { status: 500 }
    );
  }
}
