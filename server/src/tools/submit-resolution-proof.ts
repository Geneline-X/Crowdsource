import { logger } from "../logger";
import type { ToolDefinition, ToolHandler } from "./types";
import { uploadToUploadThing } from "../services/uploadthing-service";
import { notifyUpvotersOfResolution } from "../services/resolution-notifier";

export const submitResolutionProofTool: ToolDefinition = {
  type: "function",
  function: {
    name: "submit_resolution_proof",
    description: `Submit proof that a problem has been fixed by a volunteer. Accepts base64 image, uploads it, marks problem as RESOLVED, and notifies all upvoters via WhatsApp. Use when volunteer sends a photo proving they fixed the problem.`,
    parameters: {
      type: "object",
      properties: {
        problemId: {
          type: "number",
          description: "ID of the problem that was fixed",
        },
        volunteerPhone: {
          type: "string",
          description: "Phone number of volunteer who fixed it (E.164 format)",
        },
        proofImageBase64: {
          type: "string",
          description: "Base64-encoded image showing the fix",
        },
        notes: {
          type: "string",
          description: "Optional notes from the volunteer about the fix",
        },
      },
      required: ["problemId", "volunteerPhone", "proofImageBase64"],
    },
  },
};

export const submitResolutionProofHandler: ToolHandler = async (args, context) => {
  try {
    const { problemId, volunteerPhone, proofImageBase64, notes } = args;
    const { prisma } = context;

    logger.info(
      { problemId, volunteerPhone },
      "Volunteer submitting resolution proof"
    );

    // Verify problem exists
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        responses: {
          where: { userPhone: volunteerPhone },
        },
      },
    });

    if (!problem) {
      return "Problem not found.";
    }

    // Check if volunteer actually offered to help
    if (problem.responses.length === 0) {
      return "You haven't offered to help with this problem. Please use 'I can fix this' first.";
    }

    // Check if already resolved
    if (problem.status === "RESOLVED") {
      return `This problem has already been marked as resolved${problem.resolvedBy ? ` by ${problem.resolvedBy}` : ""}.`;
    }

    // Upload proof image
    logger.info({ problemId }, "Uploading resolution proof image");
    const uploadResult = await uploadToUploadThing(
      proofImageBase64,
      `resolution_${problemId}_${Date.now()}.jpg`
    );

    if (!uploadResult.success || !uploadResult.url) {
      throw new Error(uploadResult.error || "Failed to upload proof image");
    }

    const imageUrl = uploadResult.url;

    // Update problem status
    await prisma.problem.update({
      where: { id: problemId },
      data: {
        status: "RESOLVED",
        resolvedBy: volunteerPhone,
        resolvedAt: new Date(),
        resolutionProof: {
          push: imageUrl,
        },
        resolutionNotes: notes || null,
      },
    });

    // Update the volunteer's response record
    await prisma.problemResponse.updateMany({
      where: {
        problemId,
        userPhone: volunteerPhone,
      },
      data: {
        resolvedProblem: true,
        proofImages: {
          push: imageUrl,
        },
      },
    });

    // Update UserStats
    await prisma.userStats.upsert({
      where: { userPhone: volunteerPhone },
      create: {
        userPhone: volunteerPhone,
        problemsReported: 0,
        responsesOffered: 1,
      },
      update: {},
    });

    logger.info({ problemId, volunteerPhone }, "Problem marked as resolved");

    // Send notifications to all upvoters
    try {
      await notifyUpvotersOfResolution(problemId, imageUrl);
      logger.info({ problemId }, "Upvoter notifications sent");
    } catch (notificationError: any) {
      logger.error(
        { error: notificationError.message, problemId },
        "Failed to send some upvoter notifications"
      );
    }

    const upvoteCount = await prisma.problemUpvote.count({
      where: { problemId },
    });

    return `✅ *Excellent work!*

Your fix has been verified and the problem is now marked as RESOLVED!

📸 Proof image uploaded successfully

🎉 ${upvoteCount} ${upvoteCount === 1 ? "person has" : "people have"} been notified about your contribution!

Thank you for making our community better! You're now earning recognition on the Citizen Leaderboard! 🌟`;
  } catch (error: any) {
    logger.error(
      { error: error.message, problemId: args.problemId },
      "Error submitting resolution proof"
    );
    return `Sorry, there was an error processing your proof: ${error.message}. Please try again or contact support.`;
  }
};
