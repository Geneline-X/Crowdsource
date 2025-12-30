import { PrismaClient } from "@prisma/client";
import { logger } from "../logger";
import { createTimelineEvent } from "../services/timeline-service";

const prisma = new PrismaClient();

export const verifyProblemTool = {
  type: "function" as const,
  function: {
    name: "verify_problem",
    description: "Verify the location of a reported problem. Users who visit the location can confirm it's accurate. After 3 verifications, the problem is marked as verified.",
    parameters: {
      type: "object" as const,
      properties: {
        problemId: {
          type: "number",
          description: "The ID of the problem to verify",
        },
        verifierPhone: {
          type: "string",
          description: "Phone number of the user verifying the location (E.164 format)",
        },
        latitude: {
          type: "number",
          description: "Latitude coordinate from user's shared location",
        },
        longitude: {
          type: "number",
          description: "Longitude coordinate from user's shared location",
        },
      },
      required: ["problemId", "verifierPhone", "latitude", "longitude"],
    },
  },
};

export async function verifyProblemHandler(args: any): Promise<string> {
  try {
    const { problemId, verifierPhone, latitude, longitude } = args;

    // Validate inputs
    if (!problemId || !verifierPhone) {
      return "Error: Problem ID and verifier phone are required.";
    }

    if (!latitude || !longitude) {
      return `To verify this problem's location, please:

1. Tap the *+* button (attachment icon) in WhatsApp
2. Select *Location*
3. Choose *Send your current location*

This helps us confirm you're actually at the problem site and that the location is accurate. Thank you for helping our community! 📍`;
    }

    // Check if problem exists
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        verifications: true,
      },
    });

    if (!problem) {
      return `Problem #${problemId} not found.`;
    }

    // Check if user already verified (by fingerprint which is phone-based)
    const userFingerprint = verifierPhone; // Use phone as fingerprint for now
    const existingVerification = problem.verifications.find(
      (v) => v.fingerprint === userFingerprint
    );

    if (existingVerification) {
      return `You've already verified this problem. Current verifications: ${problem.verificationCount}/3`;
    }

    // Create verification record with GPS coordinates
    await prisma.problemVerification.create({
      data: {
        problemId,
        fingerprint: userFingerprint,
        latitude,
        longitude,
        imageUrls: [], // Can add images later if user uploads
      },
    });

    // Update verification count
    const newCount = problem.verificationCount + 1;
    const shouldMarkVerified = newCount >= 3;

    await prisma.problem.update({
      where: { id: problemId },
      data: {
        verificationCount: newCount,
        locationVerified: shouldMarkVerified || problem.locationVerified,
      },
    });

    // Create timeline event
    await createTimelineEvent({
      problemId,
      eventType: "VERIFIED",
      actorPhone: verifierPhone,
      metadata: {
        verificationCount: newCount,
        markedAsVerified: shouldMarkVerified,
        latitude,
        longitude,
      },
    });

    logger.info({ problemId, verifierPhone, newCount }, "Problem verified");

    // Return appropriate message
    if (shouldMarkVerified) {
      return `✅ Thank you for verifying! This problem is now marked as *VERIFIED* with ${newCount} confirmations.

"${problem.title}"

Your contribution helps our community identify accurate problem locations. 🎯`;
    } else {
      return `✅ Verification recorded! (${newCount}/3)

"${problem.title}"

We need ${3 - newCount} more verification${3 - newCount === 1 ? '' : 's'} to mark this location as confirmed. Thank you for helping! �`;
    }
  } catch (error: any) {
    logger.error({ error: error.message }, "Failed to verify problem");
    return `Error verifying problem: ${error.message}`;
  }
}

