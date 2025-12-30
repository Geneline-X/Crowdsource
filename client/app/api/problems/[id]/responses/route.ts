import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const problemId = parseInt(id, 10);

    if (isNaN(problemId)) {
      return NextResponse.json({ error: "Invalid problem ID" }, { status: 400 });
    }

    const body = await request.json();
    const { userPhone, fingerprint, message } = body;

    if (!userPhone || !fingerprint) {
      return NextResponse.json(
        { error: "Missing required fields: userPhone, fingerprint" },
        { status: 400 }
      );
    }

    // Check if problem exists
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Check if already responded
    const existing = await prisma.problemResponse.findUnique({
      where: {
        problemId_fingerprint: {
          problemId,
          fingerprint,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already offered help for this problem" },
        { status: 409 }
      );
    }

    // Create response
    const response = await prisma.problemResponse.create({
      data: {
        problemId,
        userPhone,
        fingerprint,
        message: message || null,
        status: "OFFERED",
      },
    });

    // Update or create user stats
    await prisma.userStats.upsert({
      where: { userPhone },
      create: {
        userPhone,
        responsesOffered: 1,
      },
      update: {
        responsesOffered: { increment: 1 },
      },
    });

    // Get total response count
    const responseCount = await prisma.problemResponse.count({
      where: { problemId },
    });

    // Send WhatsApp message to the volunteer
    try {
      const whatsappServerUrl = process.env.WHATSAPP_SERVER_URL!  
      const whatsappApiKey = process.env.WHATSAPP_API_KEY!

      const whatsappMessage = `🙏 *Thank you for offering to help!*\n\n*Problem:* ${problem.title}\n\n${problem.locationText ? `*Location:* ${problem.locationText}\n\n` : ""}You can now chat with our assistant to get more details about this problem and coordinate your help effort.\n\nJust reply to this message and I'll guide you through how you can assist! 💪`;

      await fetch(`${whatsappServerUrl}/send-whatsapp`, {
        method: "POST",
        headers: {
          "X-API-Key": whatsappApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneE164: userPhone,
          message: whatsappMessage,
        }),
      });


      console.log("WhatsApp notification sent to volunteer:", userPhone);
    } catch (whatsappError) {
      // Log but don't fail the request if WhatsApp fails
      console.error("Failed to send WhatsApp notification:", whatsappError);
    }

    return NextResponse.json({
      success: true,
      response: {
        id: response.id,
        createdAt: response.createdAt,
      },
      responseCount,
    });
  } catch (error) {
    console.error("Response submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit response" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const problemId = parseInt(id, 10);

    if (isNaN(problemId)) {
      return NextResponse.json({ error: "Invalid problem ID" }, { status: 400 });
    }

    const responses = await prisma.problemResponse.findMany({
      where: { problemId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        userPhone: true,
        message: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      responses: responses.map((r) => ({
        ...r,
        userPhone: r.userPhone.slice(-4).padStart(r.userPhone.length, "X"),
      })),
      count: responses.length,
    });
  } catch (error) {
    console.error("Error fetching responses:", error);
    return NextResponse.json(
      { error: "Failed to fetch responses" },
      { status: 500 }
    );
  }
}
