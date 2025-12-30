import { PrismaClient } from "@prisma/client";
import { logger } from "../logger";
import { config } from "../config";

const prisma = new PrismaClient();

/**
 * Notify all upvoters of a problem that it has been resolved
 * Sends WhatsApp messages to those with valid phone numbers
 */
export async function notifyUpvotersOfResolution(
  problemId: number,
  proofImageUrl: string
): Promise<void> {
  try {
    // Get problem with upvoters
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        upvotes: {
          select: {
            voterPhone: true,
          },
        },
      },
    });

    if (!problem) {
      logger.error({ problemId }, "Problem not found for notifications");
      return;
    }

    // Filter for valid E.164 phone numbers (starts with +)
    const validPhoneNumbers = problem.upvotes
      .map((u) => u.voterPhone)
      .filter((phone) => phone.startsWith("+") && phone.length >= 10);

    logger.info(
      { problemId, totalUpvotes: problem.upvotes.length, validPhones: validPhoneNumbers.length },
      "Sending resolution notifications"
    );

    // Send WhatsApp messages with rate limiting
    for (let i = 0; i < validPhoneNumbers.length; i++) {
      const phoneNumber = validPhoneNumbers[i];

      try {
        const caption = `✅ *Problem Resolved!*

*${problem.title}*

Great news! A community volunteer has fixed this problem you upvoted!

${problem.locationText ? `📍 Location: ${problem.locationText}\n\n` : ""}Thank you for your support in making our community better! 🙌`;

        // Send WhatsApp media (image with caption)
        await fetch(`${config.whatsapp.serverUrl}/send-media`, {
          method: "POST",
          headers: {
            "X-API-Key": config.whatsapp.apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneE164: phoneNumber,
            fileUrl: proofImageUrl,
            caption,
          }),
        });

        logger.info({ phoneNumber, problemId }, "Media notification sent");

        // Add 1 second delay between messages to avoid rate limiting
        if (i < validPhoneNumbers.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error: any) {
        logger.error(
          { error: error.message, phoneNumber, problemId },
          "Failed to send notification to upvoter"
        );
        // Continue with other notifications even if one fails
      }
    }

    logger.info(
      { problemId, notificationsSent: validPhoneNumbers.length },
      "Resolution notifications complete"
    );
  } catch (error: any) {
    logger.error(
      { error: error.message, problemId },
      "Error in notifyUpvotersOfResolution"
    );
    throw error;
  }
}

/**
 * Check if a phone number looks valid for WhatsApp
 */
function isValidPhone(phone: string): boolean {
  return phone.startsWith("+") && phone.length >= 10 && phone.length <= 15;
}
