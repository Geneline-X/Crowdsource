import OpenAI from "openai";
import { logger } from "../logger";
import { config } from "../config";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

// National categories for classification
const NATIONAL_CATEGORIES = [
  "Water & Sanitation",
  "Electricity",
  "Road Transport",
  "Health",
  "Security",
  "Education",
  "Waste Management",
  "Housing",
  "Environment",
  "Administrative / Government Service Delay",
] as const;

export type NationalCategory = (typeof NATIONAL_CATEGORIES)[number];

export interface ImageAnalysisResult {
  success: boolean;
  category?: NationalCategory;
  confidence?: number;
  description?: string;
  severity?: {
    level: "low" | "medium" | "high" | "critical";
    score: number; // 0-100
    factors: string[];
  };
  detectedObjects?: string[];
  error?: string;
}

const VISION_PROMPT = `You are an AI assistant analyzing images of community problems in Sierra Leone for a civic crowdsourcing platform.

Analyze this image and provide:
1. The most appropriate category from this list: ${NATIONAL_CATEGORIES.join(", ")}
2. A confidence score (0-100) for your category selection
3. A brief description of what you see (max 100 words)
4. Severity assessment:
   - Level: low, medium, high, or critical
   - Score: 0-100
   - Key factors contributing to severity (e.g., "blocking road", "health hazard", "structural damage")
5. List of key objects/issues detected in the image

Respond in JSON format:
{
  "category": "category name",
  "confidence": 85,
  "description": "Brief description of the problem",
  "severity": {
    "level": "medium",
    "score": 45,
    "factors": ["factor1", "factor2"]
  },
  "detectedObjects": ["object1", "object2"]
}

If you cannot determine the category or the image is unclear, set confidence to 0 and category to null.`;

/**
 * Analyze an image using OpenAI Vision API to classify the problem
 */
export async function analyzeImage(
  base64Data: string,
  mimeType: string
): Promise<ImageAnalysisResult> {
  try {
    logger.info({ mimeType }, "Starting image analysis with Vision AI");

    // Ensure we have a valid image type
    const validMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validMimeTypes.includes(mimeType)) {
      logger.warn({ mimeType }, "Unsupported image type for vision analysis");
      return {
        success: false,
        error: `Unsupported image type: ${mimeType}`,
      };
    }

    // Construct the data URL
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    const response = await openai.chat.completions.create({
      model: config.openai.visionModel || "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: VISION_PROMPT },
            {
              type: "image_url",
              image_url: {
                url: dataUrl,
                detail: "low", // Use low detail to reduce cost
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      logger.error("Vision API returned empty response");
      return {
        success: false,
        error: "Empty response from Vision API",
      };
    }

    const parsed = JSON.parse(content);

    // Validate the category
    const category = parsed.category as NationalCategory | null;
    if (category && !NATIONAL_CATEGORIES.includes(category)) {
      logger.warn({ category }, "Vision API returned invalid category");
      parsed.category = null;
      parsed.confidence = 0;
    }

    logger.info(
      {
        category: parsed.category,
        confidence: parsed.confidence,
        severityLevel: parsed.severity?.level,
      },
      "Image analysis completed"
    );

    return {
      success: true,
      category: parsed.category || undefined,
      confidence: parsed.confidence || 0,
      description: parsed.description,
      severity: parsed.severity,
      detectedObjects: parsed.detectedObjects,
    };
  } catch (error) {
    logger.error({ error }, "Failed to analyze image with Vision AI");
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Analyze an image from a URL (useful for already-uploaded images)
 */
export async function analyzeImageFromUrl(
  imageUrl: string
): Promise<ImageAnalysisResult> {
  try {
    logger.info({ imageUrl }, "Starting image analysis from URL with Vision AI");

    const response = await openai.chat.completions.create({
      model: config.openai.visionModel || "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: VISION_PROMPT },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "low",
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      logger.error("Vision API returned empty response");
      return {
        success: false,
        error: "Empty response from Vision API",
      };
    }

    const parsed = JSON.parse(content);

    const category = parsed.category as NationalCategory | null;
    if (category && !NATIONAL_CATEGORIES.includes(category)) {
      logger.warn({ category }, "Vision API returned invalid category");
      parsed.category = null;
      parsed.confidence = 0;
    }

    logger.info(
      {
        category: parsed.category,
        confidence: parsed.confidence,
        severityLevel: parsed.severity?.level,
      },
      "Image analysis from URL completed"
    );

    return {
      success: true,
      category: parsed.category || undefined,
      confidence: parsed.confidence || 0,
      description: parsed.description,
      severity: parsed.severity,
      detectedObjects: parsed.detectedObjects,
    };
  } catch (error) {
    logger.error({ error }, "Failed to analyze image from URL with Vision AI");
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
