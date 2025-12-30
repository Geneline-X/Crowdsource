import { PrismaClient } from "@prisma/client";
import { logger } from "../logger";
import { createTimelineEvent } from "../services/timeline-service";

const prisma = new PrismaClient();

export const offerHelpTool = {
  type: "function" as const,
  function: {
    name: "offer_help",
    description: "Register a user's offer to help fix a problem. This creates a volunteer response and enables the user to submit resolution proof later.",
    parameters: {
      type: "object" as const,
      properties: {
        problemId: {
          type: "number",
          description: "The ID of the problem the user wants to help fix",
        },
        userPhone: {
          type: "string",
          description: "Phone number of the volunteer (E.164 format)",
        },
        fingerprint: {
          type: "string",
          description: "Device fingerprint for tracking (use phone number as fallback)",
        },
        message: {
          type: "string",
          description: "Optional message from the volunteer about how they can help",
        },
      },
      required: ["problemId", "userPhone", "fingerprint"],
    },
  },
};

export async function offerHelpHandler(args: any): Promise<string> {
  try {
    const { problemId, userPhone, fingerprint, message } = args;

    // Validate inputs
    if (!problemId || !userPhone || !fingerprint) {
      return "Error: Problem ID, phone number, and fingerprint are required.";
    }

    // Check if problem exists
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        responses: true,
      },
    });

    if (!problem) {
      return `Problem #${problemId} not found.`;
    }

    // Check if problem is already resolved
    if (problem.status === "RESOLVED") {
      return `This problem has already been resolved! Thank you for your willingness to help. Check out other active problems that need attention.`;
    }

    // Check if user already offered help
    const existingResponse = problem.responses.find(
      (r) => r.fingerprint === fingerprint || r.userPhone === userPhone
    );

    if (existingResponse) {
      return `You've already offered to help with this problem! I'll guide you through the resolution process when you're ready to submit proof.`;
    }

    // Create help offer record
    await prisma.problemResponse.create({
      data: {
        problemId,
        userPhone,
        fingerprint,
        message: message || "Volunteer offered to help",
        status: "OFFERED",
        resolvedProblem: false,
      },
    });

    // Create timeline event
    await createTimelineEvent({
      problemId,
      eventType: "HELP_OFFERED",
      actorPhone: userPhone,
      metadata: {
        message: message || null,
      },
    });

    logger.info({ problemId, userPhone }, "Help offer registered");

    return `🙌 Thank you for volunteering to help!

**Problem:** "${problem.title}"
${problem.locationText ? `**Location:** ${problem.locationText}` : ''}

**Next Steps:**
1. Visit the location when ready
2. Take BEFORE photos (if not already done)
3. Fix the problem
4. Take AFTER photos showing the resolution
5. Send them to me with the message "I fixed problem #${problemId}"

I'll help you submit the proof and notify everyone who upvoted this problem. Your contribution makes our community better! 💪`;
  } catch (error: any) {
    logger.error({ error: error.message }, "Failed to register help offer");
    return `Error registering help offer: ${error.message}`;
  }
}
