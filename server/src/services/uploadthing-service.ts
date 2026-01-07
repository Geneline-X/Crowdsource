import { UTApi, UTFile } from "uploadthing/server";
import { logger } from "../logger";
import { webcrypto } from "node:crypto";

// Cast to Crypto to avoid type mismatch between Node's implementation and the global Crypto type
//globalThis.crypto = webcrypto as unknown as Crypto;

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
 * Upload a file to UploadThing from base64 data or a URL
 */
export async function uploadToUploadThing(
  data: string,
  filename: string,
  mimeType: string = "image/jpeg"
): Promise<UploadResult> {
  try {
    let buffer: Buffer;

    // Check if input is a URL
    if (data.startsWith("http://") || data.startsWith("https://")) {
      logger.info({ url: data }, "Fetching image from URL for upload");
      const response = await fetch(data);
      if (!response.ok) {
        throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(new Uint8Array(arrayBuffer));
    } else {
      // Treat as base64
      // Remove data URI prefix if present (e.g. "data:image/jpeg;base64,")
      const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
      buffer = Buffer.from(base64Data, "base64");
    }
    
    // Create a UTFile object (UploadThing's server-side File implementation)
    // This avoids issues with Node.js File/Blob compatibility
    // Casting to any to avoid "Type 'Buffer<ArrayBufferLike>' is not assignable to type 'BlobPart'" error
    const file = new UTFile([buffer as any], filename, { type: mimeType });
    
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
