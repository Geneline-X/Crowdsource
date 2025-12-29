import { ToolDefinition, ToolHandler } from "./types";
import { logger } from "../logger";
import { uploadToUploadThing } from "../services/uploadthing-service";

export const uploadImageTool: ToolDefinition = {
  type: "function",
  function: {
    name: "upload_image",
    description:
      "Upload an image to cloud storage and return the URL. Can use image from current message context if available.",
    parameters: {
      type: "object",
      properties: {
        image: {
          type: "string",
          description: "Base64 encoded image data (optional if image is in context)",
        },
      },
      required: [],
    },
  },
};

export const uploadImageHandler: ToolHandler = async (args, context) => {
  let { image } = args;
  const { prisma, currentUserPhone, currentProblemContext, currentMediaContext } = context;

  // If no image provided in args, or if it looks like a filename (short string), check context
  if ((!image || image.length < 100) && currentMediaContext?.hasMedia && currentMediaContext.data) {
    logger.info("Using image from message context (arg was missing or filename)");
    image = currentMediaContext.data;
  }

  if (!image) {
    logger.error({ phone: currentUserPhone }, "No image data provided for upload");
    return {
      success: false,
      error: "No image data provided",
      message: "Please provide an image to upload.",
    };
  }

  try {
    logger.info(
      { phone: currentUserPhone, imageLength: image.length },
      "Uploading image via UploadThing"
    );

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedPhone = currentUserPhone?.replace(/\+/g, "") || "anonymous";
    const filename = `problem_${sanitizedPhone}_${timestamp}.jpg`;

    // Upload to UploadThing
    const result = await uploadToUploadThing(image, filename, "image/jpeg");

    if (!result.success || !result.url) {
      logger.error({ error: result.error, phone: currentUserPhone }, "UploadThing upload failed");
      return {
        success: false,
        error: result.error || "Upload failed",
        url: "",
      };
    }

    const url = result.url;

    // Link to problem if we have a problem context
    const problemId = currentProblemContext?.problemId
      ? parseInt(currentProblemContext.problemId)
      : undefined;

    if (problemId) {
      await prisma.media.create({
        data: {
          url: url,
          mimeType: "image/jpeg",
          size: Buffer.byteLength(image, "base64"),
          problemId: problemId,
        },
      });
      logger.info({ problemId, url }, "Image linked to problem");
    }

    return {
      success: true,
      url: url,
    };
  } catch (error) {
    logger.error({ error, phone: currentUserPhone }, "Failed to upload image");
    // Continue without image - don't fail the whole problem report
    return {
      success: false,
      url: "",
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
};