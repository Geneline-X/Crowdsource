import axios from "axios";
import FormData from "form-data";
import { logger } from "../logger";
import { config } from "../config";

/**
 * Check if the MIME type is an audio type
 */
export function isAudioMimeType(mimeType: string): boolean {
  if (!mimeType) return false;
  
  const audioTypes = [
    "audio/ogg",
    "audio/opus",
    "audio/mpeg",
    "audio/mp3",
    "audio/mp4",
    "audio/wav",
    "audio/webm",
    "audio/aac",
    "audio/x-wav",
  ];
  
  return (
    mimeType.startsWith("audio/") || 
    audioTypes.includes(mimeType.toLowerCase())
  );
}

/**
 * Transcribe audio using the Go AI Gateway ASR service.
 * Sends the audio as multipart/form-data to /api/v1/transcribe
 * 
 * @param audioBase64 - Base64 encoded audio data
 * @param mimeType - MIME type of the audio (e.g., "audio/ogg")
 * @param filename - Optional filename for the audio file
 * @returns Transcribed text
 */
export async function transcribeAudio(
  audioBase64: string,
  mimeType: string,
  filename?: string
): Promise<string> {
  const gatewayUrl = config.asr.gatewayUrl;
  const apiKey = config.asr.apiKey;

  if (!gatewayUrl) {
    throw new Error("ASR Gateway URL not configured");
  }

  if (!apiKey) {
    throw new Error("ASR API key not configured");
  }

  // Convert base64 to buffer
  const audioBuffer = Buffer.from(audioBase64, "base64");
  
  // Determine file extension from MIME type
  const extensionMap: Record<string, string> = {
    "audio/ogg": "ogg",
    "audio/opus": "opus",
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
    "audio/mp4": "m4a",
    "audio/wav": "wav",
    "audio/webm": "webm",
    "audio/aac": "aac",
    "audio/x-wav": "wav",
  };
  
  const extension = extensionMap[mimeType.toLowerCase()] || "ogg";
  const finalFilename = filename || `audio_${Date.now()}.${extension}`;

  // Create form data
  const formData = new FormData();
  formData.append("file", audioBuffer, {
    filename: finalFilename,
    contentType: mimeType,
  });

  logger.info(
    { 
      gatewayUrl, 
      mimeType, 
      filename: finalFilename,
      audioSize: audioBuffer.length 
    },
    "Sending audio to ASR Gateway"
  );

  try {
    const response = await axios.post(
      `${gatewayUrl}/api/v1/transcribe`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "X-API-Key": apiKey,
        },
        timeout: 60000, // 60 second timeout for transcription
      }
    );

    // The gateway returns { krio_text: "...", english: "..." } or { text: "..." }
    const transcribedText = 
      response.data?.english ||      // English translation
      response.data?.krio_text ||    // Krio text
      response.data?.text ||         // Generic text field
      response.data?.transcript ||   // Transcript field
      "";
    
    if (!transcribedText) {
      logger.warn({ response: response.data }, "Empty transcription response");
      throw new Error("Empty transcription response");
    }

    logger.info(
      { transcribedLength: transcribedText.length },
      "Audio transcribed successfully"
    );

    return transcribedText;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message;
    logger.error(
      { error: errorMessage, statusCode: error.response?.status },
      "Failed to transcribe audio"
    );
    throw new Error(`Transcription failed: ${errorMessage}`);
  }
}
