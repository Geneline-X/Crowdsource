import { logger } from "../logger";
import type { ToolDefinition, ToolHandler } from "./types";

export const getProblemDetailsForVolunteerTool: ToolDefinition = {
  type: "function",
  function: {
    name: "get_problem_details_for_volunteer",
    description: `Get comprehensive details about a problem that a volunteer has offered to help with. Returns full problem info, location, upvote count, and verification images. Use when volunteer asks about the problem they want to fix.`,
    parameters: {
      type: "object",
      properties: {
        problemId: {
          type: "number",
          description: "The ID of the problem to get details for",
        },
        volunteerPhone: {
          type: "string",
          description: "Phone number of the volunteer (E.164 format)",
        },
      },
      required: ["problemId", "volunteerPhone"],
    },
  },
};

export const getProblemDetailsForVolunteerHandler: ToolHandler = async (args, context) => {
  try {
    const { problemId, volunteerPhone } = args;
    const { prisma } = context;

    logger.info(
      { problemId, volunteerPhone },
      "Getting problem details for volunteer"
    );

    // Get problem with all related data
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        verifications: {
          select: {
            imageUrls: true,
            latitude: true,
            longitude: true,
            createdAt: true,
          },
        },
        upvotes: true,
        responses: {
          where: {
            userPhone: volunteerPhone,
          },
        },
      },
    });

    if (!problem) {
      return "Problem not found. Please check the problem ID.";
    }

    // Check if this volunteer has actually offered to help
    if (problem.responses.length === 0) {
      return `You haven't offered to help with this problem yet. Would you like to offer your assistance?`;
    }

    // Format response for WhatsApp
    let response = `📋 *Problem Details*\n\n`;
    response += `*Title:* ${problem.title}\n\n`;
    response += `*Description:* ${problem.rawMessage}\n\n`;

    if (problem.locationText) {
      response += `📍 *Location:* ${problem.locationText}\n`;
    }

    if (problem.latitude && problem.longitude) {
      response += `*Coordinates:* ${problem.latitude}, ${problem.longitude}\n`;
    }

    response += `\n👍 *Community Support:* ${problem.upvoteCount} upvotes\n`;

    if (problem.verifications && problem.verifications.length > 0) {
      response += `\n✅ *Verifications:* ${problem.verifications.length} community members have verified this\n`;

      // Include verification images
      const verificationImages = problem.verifications
        .flatMap((v: any) => v.imageUrls)
        .filter(Boolean);

      if (verificationImages.length > 0) {
        response += `\n📸 *Verification Photos Available:*\n`;
        verificationImages.slice(0, 3).forEach((url: string, idx: number) => {
          response += `${idx + 1}. ${url}\n`;
        });
      }
    }

    if (problem.status === "RESOLVED") {
      response += `\n✅ *Status:* This problem has already been resolved!\n`;
      if (problem.resolvedAt) {
        response += `Resolved on: ${problem.resolvedAt.toLocaleDateString()}\n`;
      }
    } else {
      response += `\n*Status:* ${problem.status}\n`;
      response += `\n💪 Ready to help fix this? When you're done, send me a photo as proof and I'll notify everyone!`;
    }

    return response;
  } catch (error: any) {
    logger.error({ error: error.message }, "Error getting problem details");
    return "Sorry, there was an error retrieving the problem details. Please try again.";
  }
};
