import { PrismaClient } from "@prisma/client";
import { logger } from "../logger";

const prisma = new PrismaClient();

export const getLeaderboardTool = {
  type: "function" as const,
  function: {
    name: "get_leaderboard",
    description: "Get the volunteer leaderboard showing top contributors. Can filter by specific metrics like problems reported, upvotes, verifications, or responses offered.",
    parameters: {
      type: "object" as const,
      properties: {
        limit: {
          type: "number",
          description: "Number of top volunteers to show (default: 10)",
        },
        metric: {
          type: "string",
          description: "What to rank by: 'all' (combined score), 'problems' (problems reported), 'upvotes', 'verifications', or 'responses' (help offers)",
        },
      },
      required: [],
    },
  },
};

export async function getLeaderboardHandler(args: any): Promise<string> {
  try {
    const limit = args.limit || 10;
    const metric = args.metric || "all";

    // Fetch user stats
    const userStats = await prisma.userStats.findMany({
      where: {
        displayInLeaderboard: true,
      },
      orderBy:
        metric === "problems"
          ? { problemsReported: "desc" }
          : metric === "upvotes"
          ? { upvotesGiven: "desc" }
          : metric === "verifications"
          ? { verificationsGiven: "desc" }
          : metric === "responses"
          ? { responsesOffered: "desc" }
          : [
              { problemsReported: "desc" },
              { responsesOffered: "desc" },
              { upvotesGiven: "desc" },
            ],
      take: limit,
    });

    if (userStats.length === 0) {
      return "No leaderboard data available yet. Be the first to contribute!";
    }

    // Build leaderboard message
    let message = `🏆 *Top ${limit} Contributors*\n\n`;

    if (metric !== "all") {
      const metricNames: Record<string, string> = {
        problems: "Problems Reported",
        upvotes: "Upvotes Given",
        verifications: "Verifications Given",
        responses: "Help Offers",
      };
      message += `📊 *Ranked by:* ${metricNames[metric]}\n\n`;
    }

    userStats.forEach((user, index) => {
      const rank = index + 1;
      const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `${rank}.`;

      // Mask phone number for privacy
      const maskedPhone = user.userPhone.slice(-4).padStart(
        user.userPhone.length,
        "X"
      );

      message += `${medal} *${maskedPhone}*\n`;

      if (metric === "all") {
        const stats = [];
        if (user.problemsReported > 0)
          stats.push(`📢 ${user.problemsReported} reported`);
        if (user.responsesOffered > 0)
          stats.push(`� ${user.responsesOffered} offers`);
        if (user.upvotesGiven > 0)
          stats.push(`� ${user.upvotesGiven} upvotes`);
        if (user.verificationsGiven > 0)
          stats.push(`✅ ${user.verificationsGiven} verified`);

        message += `   ${stats.join(" • ")}\n\n`;
      } else {
        const value =
          metric === "problems"
            ? user.problemsReported
            : metric === "upvotes"
            ? user.upvotesGiven
            : metric === "verifications"
            ? user.verificationsGiven
            : user.responsesOffered;
        message += `   ${value} ${metric}\n\n`;
      }
    });

    message += `\n💪 Keep up the great work, everyone!`;

    return message;
  } catch (error: any) {
    logger.error({ error: error.message }, "Failed to fetch leaderboard");
    return `Error fetching leaderboard: ${error.message}`;
  }
}
