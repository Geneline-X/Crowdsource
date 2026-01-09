import { PrismaClient, Problem, ProblemStatus } from "@prisma/client";
import { logger } from "../logger";

// Category urgency weights (higher = more urgent)
const CATEGORY_URGENCY: Record<string, number> = {
  "Security": 100,
  "Health": 90,
  "Water & Sanitation": 80,
  "Electricity": 70,
  "Road Transport": 60,
  "Environment": 55,
  "Waste Management": 50,
  "Housing": 45,
  "Education": 40,
  "Administrative / Government Service Delay": 30,
};

// Status multipliers
const STATUS_MULTIPLIERS: Record<ProblemStatus, number> = {
  REPORTED: 1.0,
  IN_REVIEW: 0.9,
  IN_PROGRESS: 0.7,
  RESOLVED: 0.1,
  REJECTED: 0,
};

export interface SeverityBreakdown {
  upvoteScore: number;
  timeScore: number;
  categoryScore: number;
  verificationScore: number;
  statusMultiplier: number;
  totalScore: number;
}

/**
 * Calculate severity score for a problem
 * 
 * Factors and weights:
 * - Upvotes: 40% - More upvotes = higher priority
 * - Time decay: 20% - Older problems get slight boost (lingering issues)
 * - Category urgency: 25% - Security/Health more urgent than admin delays
 * - Verification count: 15% - More verifications = confirmed issue
 */
export function calculateSeverityScore(problem: {
  upvoteCount: number;
  verificationCount: number;
  nationalCategory: string | null;
  status: ProblemStatus;
  createdAt: Date;
}): SeverityBreakdown {
  // Upvote score (0-100, logarithmic scale)
  // 0 upvotes = 0, 1 = 20, 5 = 46, 10 = 60, 50 = 85, 100 = 100
  const upvoteScore = Math.min(100, Math.log10(problem.upvoteCount + 1) * 50);

  // Time score - older unresolved problems get higher priority
  // Max boost after 30 days (100), linear growth
  const ageInDays = (Date.now() - problem.createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const timeScore = Math.min(100, (ageInDays / 30) * 100);

  // Category urgency score
  const categoryScore = CATEGORY_URGENCY[problem.nationalCategory || ""] || 30;

  // Verification score (0-100, logarithmic)
  // More verifications confirm the issue is real
  const verificationScore = Math.min(100, Math.log10(problem.verificationCount + 1) * 60);

  // Status multiplier
  const statusMultiplier = STATUS_MULTIPLIERS[problem.status] || 1.0;

  // Calculate weighted total
  const rawScore =
    upvoteScore * 0.4 +
    timeScore * 0.2 +
    categoryScore * 0.25 +
    verificationScore * 0.15;

  // Apply status multiplier
  const totalScore = Math.round(rawScore * statusMultiplier * 100) / 100;

  return {
    upvoteScore: Math.round(upvoteScore * 100) / 100,
    timeScore: Math.round(timeScore * 100) / 100,
    categoryScore,
    verificationScore: Math.round(verificationScore * 100) / 100,
    statusMultiplier,
    totalScore,
  };
}

/**
 * Update severity score for a single problem
 */
export async function updateProblemSeverity(
  prisma: PrismaClient,
  problemId: number
): Promise<number | null> {
  try {
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      select: {
        upvoteCount: true,
        verificationCount: true,
        nationalCategory: true,
        status: true,
        createdAt: true,
      },
    });

    if (!problem) {
      logger.warn({ problemId }, "Problem not found for severity update");
      return null;
    }

    const breakdown = calculateSeverityScore(problem);

    await prisma.problem.update({
      where: { id: problemId },
      data: {
        severityScore: breakdown.totalScore,
        severityLastUpdated: new Date(),
      },
    });

    logger.debug({ problemId, severity: breakdown.totalScore }, "Severity score updated");
    return breakdown.totalScore;
  } catch (error) {
    logger.error({ error, problemId }, "Failed to update problem severity");
    return null;
  }
}

/**
 * Batch update severity scores for all active problems
 * Useful for cron jobs
 */
export async function updateAllSeverityScores(
  prisma: PrismaClient
): Promise<{ updated: number; failed: number }> {
  let updated = 0;
  let failed = 0;

  try {
    logger.info("Starting batch severity score update");

    // Get all non-resolved, non-rejected problems
    const problems = await prisma.problem.findMany({
      where: {
        status: {
          notIn: ["RESOLVED", "REJECTED"],
        },
      },
      select: {
        id: true,
        upvoteCount: true,
        verificationCount: true,
        nationalCategory: true,
        status: true,
        createdAt: true,
      },
    });

    // Update each problem
    for (const problem of problems) {
      try {
        const breakdown = calculateSeverityScore(problem);
        await prisma.problem.update({
          where: { id: problem.id },
          data: {
            severityScore: breakdown.totalScore,
            severityLastUpdated: new Date(),
          },
        });
        updated++;
      } catch (error) {
        logger.error({ error, problemId: problem.id }, "Failed to update severity for problem");
        failed++;
      }
    }

    logger.info({ updated, failed, total: problems.length }, "Batch severity update completed");
    return { updated, failed };
  } catch (error) {
    logger.error({ error }, "Failed to run batch severity update");
    return { updated, failed };
  }
}

/**
 * Get problems sorted by severity score
 */
export async function getProblemsOrderedBySeverity(
  prisma: PrismaClient,
  options: {
    limit?: number;
    offset?: number;
    status?: ProblemStatus | ProblemStatus[];
    minSeverity?: number;
  } = {}
): Promise<Problem[]> {
  const { limit = 20, offset = 0, status, minSeverity } = options;

  const whereClause: any = {};

  if (status) {
    whereClause.status = Array.isArray(status) ? { in: status } : status;
  }

  if (minSeverity !== undefined) {
    whereClause.severityScore = { gte: minSeverity };
  }

  return prisma.problem.findMany({
    where: whereClause,
    orderBy: { severityScore: "desc" },
    take: limit,
    skip: offset,
    include: {
      images: true,
    },
  });
}

/**
 * Get severity level label from score
 */
export function getSeverityLevel(score: number): "low" | "medium" | "high" | "critical" {
  if (score >= 75) return "critical";
  if (score >= 50) return "high";
  if (score >= 25) return "medium";
  return "low";
}

/**
 * Get severity color for UI
 */
export function getSeverityColor(score: number): string {
  if (score >= 75) return "#e5484d"; // Red
  if (score >= 50) return "#f5a623"; // Orange
  if (score >= 25) return "#0091ff"; // Blue
  return "#30a46c"; // Green
}
