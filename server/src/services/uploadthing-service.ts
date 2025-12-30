import { UTApi, UTFile } from "uploadthing/server";
import { logger } from "../logger";

// Initialize UploadThing API
const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

/**
 * Upload a file to UploadThing from base64 data
 */
export async function uploadToUploadThing(
  base64Data: string,
  filename: string,
  mimeType: string = "image/jpeg"
): Promise<UploadResult> {
  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, "base64");
    
    // Create a UTFile object (UploadThing's server-side File implementation)
    // This avoids issues with Node.js File/Blob compatibility
    const file = new UTFile([buffer], filename, { type: mimeType });
    
    // Upload to UploadThing - must pass as array
    const response = await utapi.uploadFiles([file]);
    
    if (!response || !Array.isArray(response) || response.length === 0) {
      logger.error("UploadThing returned empty response");
      return { success: false, error: "Upload failed - empty response" };
    }

    const result = response[0];
    
    if (result.error) {
      logger.error({ error: result.error }, "UploadThing upload failed");
      return { success: false, error: result.error.message };
    }

    if (!result.data) {
      logger.error("UploadThing returned no data");
      return { success: false, error: "Upload failed - no data returned" };
    }

    logger.info({ url: result.data.url, key: result.data.key }, "UploadThing upload successful");
    
    return {
      success: true,
      url: result.data.url,
      key: result.data.key,
    };
  } catch (error) {
    logger.error({ error }, "UploadThing upload error");
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown upload error",
    };
  }
}

/**
 * Delete a file from UploadThing
 */
export async function deleteFromUploadThing(key: string): Promise<boolean> {
  try {
    await utapi.deleteFiles([key]);
    logger.info({ key }, "UploadThing file deleted");
    return true;
  } catch (error) {
    logger.error({ error, key }, "Failed to delete file from UploadThing");
    return false;
  }
}
