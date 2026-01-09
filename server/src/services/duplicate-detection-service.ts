import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";
import { logger } from "../logger";
import { config } from "../config";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

export interface SimilarProblem {
  id: number;
  title: string;
  locationText: string | null;
  similarity: number;
  createdAt: Date;
  upvoteCount: number;
}

export interface DuplicateCheckResult {
  hasPotentialDuplicates: boolean;
  duplicates: SimilarProblem[];
  highestSimilarity: number;
}

// Embedding dimension for text-embedding-3-small
const EMBEDDING_DIMENSION = 1536;

/**
 * Generate an embedding vector for text using OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    logger.info({ textLength: text.length }, "Generating text embedding");

    const response = await openai.embeddings.create({
      model: config.openai.embeddingModel || "text-embedding-3-small",
      input: text.slice(0, 8000), // Limit input to avoid token limits
    });

    const embedding = response.data[0]?.embedding;
    if (!embedding || embedding.length !== EMBEDDING_DIMENSION) {
      throw new Error("Invalid embedding response");
    }

    logger.info({ embeddingDim: embedding.length }, "Embedding generated successfully");
    return embedding;
  } catch (error) {
    logger.error({ error }, "Failed to generate embedding");
    throw error;
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Find problems similar to the given text
 */
export async function findSimilarProblems(
  prisma: PrismaClient,
  text: string,
  excludeProblemId?: number,
  threshold: number = 0.8,
  limit: number = 5
): Promise<DuplicateCheckResult> {
  try {
    logger.info({ threshold, excludeProblemId }, "Searching for similar problems");

    // Generate embedding for the input text
    const queryEmbedding = await generateEmbedding(text);

    // Fetch problems with embeddings (only those that have embeddings)
    const problems = await prisma.problem.findMany({
      where: {
        id: excludeProblemId ? { not: excludeProblemId } : undefined,
        embedding: { isEmpty: false },
        status: { not: "REJECTED" },
      },
      select: {
        id: true,
        title: true,
        locationText: true,
        embedding: true,
        createdAt: true,
        upvoteCount: true,
      },
    });

    // Calculate similarities
    const similarities: SimilarProblem[] = [];
    for (const problem of problems) {
      if (!problem.embedding || problem.embedding.length !== EMBEDDING_DIMENSION) {
        continue;
      }

      const similarity = cosineSimilarity(queryEmbedding, problem.embedding);
      if (similarity >= threshold) {
        similarities.push({
          id: problem.id,
          title: problem.title,
          locationText: problem.locationText,
          similarity: Math.round(similarity * 100) / 100,
          createdAt: problem.createdAt,
          upvoteCount: problem.upvoteCount,
        });
      }
    }

    // Sort by similarity descending
    similarities.sort((a, b) => b.similarity - a.similarity);

    // Limit results
    const topSimilar = similarities.slice(0, limit);

    logger.info(
      { found: topSimilar.length, highestSimilarity: topSimilar[0]?.similarity },
      "Similar problems search completed"
    );

    return {
      hasPotentialDuplicates: topSimilar.length > 0,
      duplicates: topSimilar,
      highestSimilarity: topSimilar[0]?.similarity || 0,
    };
  } catch (error) {
    logger.error({ error }, "Failed to find similar problems");
    return {
      hasPotentialDuplicates: false,
      duplicates: [],
      highestSimilarity: 0,
    };
  }
}

/**
 * Mark a problem as a duplicate of another
 */
export async function markAsDuplicate(
  prisma: PrismaClient,
  duplicateId: number,
  originalId: number
): Promise<boolean> {
  try {
    logger.info({ duplicateId, originalId }, "Marking problem as duplicate");

    // Verify both problems exist
    const [duplicate, original] = await Promise.all([
      prisma.problem.findUnique({ where: { id: duplicateId } }),
      prisma.problem.findUnique({ where: { id: originalId } }),
    ]);

    if (!duplicate || !original) {
      logger.warn({ duplicateId, originalId }, "One or both problems not found");
      return false;
    }

    // Update the duplicate to reference the original
    await prisma.problem.update({
      where: { id: duplicateId },
      data: { duplicateOf: originalId },
    });

    // Transfer upvotes to the original (increment by duplicate's count)
    await prisma.problem.update({
      where: { id: originalId },
      data: {
        upvoteCount: { increment: duplicate.upvoteCount },
      },
    });

    logger.info({ duplicateId, originalId }, "Problem marked as duplicate successfully");
    return true;
  } catch (error) {
    logger.error({ error }, "Failed to mark problem as duplicate");
    return false;
  }
}

/**
 * Generate and store embedding for a problem
 */
export async function generateAndStoreProblemEmbedding(
  prisma: PrismaClient,
  problemId: number
): Promise<boolean> {
  try {
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      select: { title: true, rawMessage: true, locationText: true },
    });

    if (!problem) {
      logger.warn({ problemId }, "Problem not found for embedding generation");
      return false;
    }

    // Combine title, description, and location for embedding
    const textForEmbedding = [
      problem.title,
      problem.rawMessage,
      problem.locationText,
    ]
      .filter(Boolean)
      .join(" ");

    const embedding = await generateEmbedding(textForEmbedding);

    await prisma.problem.update({
      where: { id: problemId },
      data: { embedding },
    });

    logger.info({ problemId }, "Problem embedding stored successfully");
    return true;
  } catch (error) {
    logger.error({ error, problemId }, "Failed to generate and store embedding");
    return false;
  }
}
