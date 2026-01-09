import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logger } from "../logger";
import { config } from "../config";
import {
  getProblemsOrderedBySeverity,
  updateAllSeverityScores,
  calculateSeverityScore,
  getSeverityLevel,
  getSeverityColor,
} from "../services/severity-scoring-service";
import {
  findSimilarProblems,
  markAsDuplicate,
  generateAndStoreProblemEmbedding,
} from "../services/duplicate-detection-service";
import { analyzeImageFromUrl } from "../services/vision-ai-service";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/problems/severity-ranking
 * Get problems sorted by severity score
 */
router.get("/problems/severity-ranking", async (req: Request, res: Response) => {
  try {
    const { limit = "20", offset = "0", status, minSeverity } = req.query;

    const problems = await getProblemsOrderedBySeverity(prisma, {
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10),
      status: status as any,
      minSeverity: minSeverity ? parseFloat(minSeverity as string) : undefined,
    });

    // Add severity metadata to each problem
    const enrichedProblems = problems.map((problem) => ({
      ...problem,
      severityLevel: getSeverityLevel(problem.severityScore),
      severityColor: getSeverityColor(problem.severityScore),
    }));

    res.json({
      success: true,
      data: enrichedProblems,
      pagination: {
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10),
        total: enrichedProblems.length,
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to get severity ranking");
    res.status(500).json({ success: false, error: "Failed to get severity ranking" });
  }
});

/**
 * GET /api/problems/:id/similar
 * Get similar problems (potential duplicates)
 */
router.get("/problems/:id/similar", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { threshold = "0.7" } = req.query;

    const problem = await prisma.problem.findUnique({
      where: { id: parseInt(id, 10) },
      select: { title: true, rawMessage: true, locationText: true },
    });

    if (!problem) {
      return res.status(404).json({ success: false, error: "Problem not found" });
    }

    const text = `${problem.title} ${problem.rawMessage} ${problem.locationText || ""}`;
    const similarProblems = await findSimilarProblems(
      prisma,
      text,
      parseInt(id, 10),
      parseFloat(threshold as string)
    );

    res.json({
      success: true,
      data: similarProblems,
    });
  } catch (error) {
    logger.error({ error }, "Failed to find similar problems");
    res.status(500).json({ success: false, error: "Failed to find similar problems" });
  }
});

/**
 * GET /api/problems/:id/ai-analysis
 * Get AI analysis for a problem
 */
router.get("/problems/:id/ai-analysis", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reanalyze = "false" } = req.query;

    const problem = await prisma.problem.findUnique({
      where: { id: parseInt(id, 10) },
      include: { images: true },
    });

    if (!problem) {
      return res.status(404).json({ success: false, error: "Problem not found" });
    }

    // If we have cached analysis and don't need to reanalyze
    if (problem.imageAnalysis && reanalyze !== "true") {
      const severityBreakdown = calculateSeverityScore(problem);
      return res.json({
        success: true,
        data: {
          aiCategory: problem.aiCategory,
          aiCategoryConfidence: problem.aiCategoryConfidence,
          imageAnalysis: problem.imageAnalysis,
          severity: {
            score: problem.severityScore,
            level: getSeverityLevel(problem.severityScore),
            color: getSeverityColor(problem.severityScore),
            breakdown: severityBreakdown,
          },
        },
      });
    }

    // Reanalyze if requested and has images
    if (reanalyze === "true" && problem.images.length > 0) {
      const imageUrl = problem.images[0].url;
      const analysis = await analyzeImageFromUrl(imageUrl);

      if (analysis.success) {
        await prisma.problem.update({
          where: { id: problem.id },
          data: {
            aiCategory: analysis.category,
            aiCategoryConfidence: analysis.confidence,
            imageAnalysis: analysis as any,
          },
        });

        return res.json({
          success: true,
          data: {
            aiCategory: analysis.category,
            aiCategoryConfidence: analysis.confidence,
            imageAnalysis: analysis,
            reanalyzed: true,
          },
        });
      }
    }

    // Return current severity even without image analysis
    const severityBreakdown = calculateSeverityScore(problem);
    res.json({
      success: true,
      data: {
        aiCategory: problem.aiCategory || null,
        aiCategoryConfidence: problem.aiCategoryConfidence || null,
        imageAnalysis: problem.imageAnalysis || null,
        severity: {
          score: problem.severityScore,
          level: getSeverityLevel(problem.severityScore),
          color: getSeverityColor(problem.severityScore),
          breakdown: severityBreakdown,
        },
      },
    });
  } catch (error) {
    logger.error({ error }, "Failed to get AI analysis");
    res.status(500).json({ success: false, error: "Failed to get AI analysis" });
  }
});

/**
 * POST /api/problems/:id/merge
 * Merge a problem into another (mark as duplicate)
 */
router.post("/problems/:id/merge", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { originalId } = req.body;

    if (!originalId) {
      return res.status(400).json({ success: false, error: "originalId is required" });
    }

    const success = await markAsDuplicate(
      prisma,
      parseInt(id, 10),
      parseInt(originalId, 10)
    );

    if (!success) {
      return res.status(400).json({ success: false, error: "Failed to merge problems" });
    }

    res.json({
      success: true,
      message: `Problem #${id} has been merged into #${originalId}`,
    });
  } catch (error) {
    logger.error({ error }, "Failed to merge problems");
    res.status(500).json({ success: false, error: "Failed to merge problems" });
  }
});

/**
 * POST /api/problems/:id/generate-embedding
 * Generate embedding for a problem (useful for backfilling)
 */
router.post("/problems/:id/generate-embedding", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const success = await generateAndStoreProblemEmbedding(prisma, parseInt(id, 10));

    if (!success) {
      return res.status(400).json({ success: false, error: "Failed to generate embedding" });
    }

    res.json({
      success: true,
      message: `Embedding generated for problem #${id}`,
    });
  } catch (error) {
    logger.error({ error }, "Failed to generate embedding");
    res.status(500).json({ success: false, error: "Failed to generate embedding" });
  }
});

/**
 * POST /api/admin/recalculate-severity
 * Batch recalculate severity scores for all problems
 */
router.post("/admin/recalculate-severity", async (req: Request, res: Response) => {
  try {
    const result = await updateAllSeverityScores(prisma);

    res.json({
      success: true,
      message: `Updated ${result.updated} problems, ${result.failed} failed`,
      data: result,
    });
  } catch (error) {
    logger.error({ error }, "Failed to recalculate severity scores");
    res.status(500).json({ success: false, error: "Failed to recalculate severity scores" });
  }
});

export default router;
