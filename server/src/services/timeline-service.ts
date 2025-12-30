import { PrismaClient } from "@prisma/client";
import { logger } from "../logger";

const prisma = new PrismaClient();

export type TimelineEventType = 
  | "REPORTED"
  | "UPVOTED"
  | "VERIFIED"
  | "HELP_OFFERED"
  | "RESOLVED";

interface CreateTimelineEventParams {
  problemId: number;
  eventType: TimelineEventType;
  actorPhone?: string;
  metadata?: Record<string, any>;
}

/**
 * Create a timeline event for a problem
 */
export async function createTimelineEvent({
  problemId,
  eventType,
  actorPhone,
  metadata,
}: CreateTimelineEventParams): Promise<void> {
  try {
    await prisma.problemTimelineEvent.create({
      data: {
        problemId,
        eventType,
        actorPhone,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
      },
    });

    logger.info(
      { problemId, eventType, actorPhone },
      "Timeline event created"
    );
  } catch (error: any) {
    logger.error(
      { error: error.message, problemId, eventType },
      "Failed to create timeline event"
    );
    // Don't throw - timeline events shouldn't break the main flow
  }
}

/**
 * Get all timeline events for a problem
 */
export async function getProblemTimeline(problemId: number) {
  try {
    const events = await prisma.problemTimelineEvent.findMany({
      where: { problemId },
      orderBy: { createdAt: "asc" },
    });

    return events;
  } catch (error: any) {
    logger.error(
      { error: error.message, problemId },
      "Failed to fetch timeline"
    );
    return [];
  }
}

/**
 * Get timeline event count by type
 */
export async function getTimelineStats(problemId: number) {
  try {
    const events = await prisma.problemTimelineEvent.groupBy({
      by: ["eventType"],
      where: { problemId },
      _count: true,
    });

    return events.reduce((acc, event) => {
      acc[event.eventType] = event._count;
      return acc;
    }, {} as Record<string, number>);
  } catch (error: any) {
    logger.error(
      { error: error.message, problemId },
      "Failed to fetch timeline stats"
    );
    return {};
  }
}
