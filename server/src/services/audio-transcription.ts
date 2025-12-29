import axios from "axios";
import FormData from "form-data";
import { logger } from "../logger";
import { config } from "../config";

/**
 * Supported audio MIME types for transcription
 */
const SUPPORTED_AUDIO_MIME_TYPES = [
  "audio/ogg",
  "audio/opus",
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/wav",
  "audio/webm",
  "audio/aac",
  "audio/x-wav",
] as const;

/**
 * Mapping of MIME types to file extensions
 */
const MIME_TYPE_TO_EXTENSION: Record<string, string> = {
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

/**
 * Default timeout for API requests (in milliseconds)
 */
const API_TIMEOUT_MS = 60000;

/**
 * Default file extension for audio files
 */
const DEFAULT_AUDIO_EXTENSION = "ogg";

/**
 * Response structure from the transcription endpoint
 */
interface TranscriptionResponse {
  krio_text?: string;
  english?: string;
}

/**
 * Response structure from the translation endpoint
 */
interface TranslationResponse {
  translated_text?: string;
}

/**
 * Parameters for translation request
 */
interface TranslationRequest {
  text: string;
  source_lang: string;
  target_lang: string;
}


/**
 * Determines the file extension based on MIME type
 * 
 * @param mimeType - The MIME type of the audio file
 * @returns The corresponding file extension
 */
function getFileExtension(mimeType: string): string {
  const normalizedMimeType = mimeType.toLowerCase();
  return MIME_TYPE_TO_EXTENSION[normalizedMimeType] || DEFAULT_AUDIO_EXTENSION;
}

/**
 * Generates a filename for the audio file
 * 
 * @param mimeType - The MIME type of the audio file
 * @param customFilename - Optional custom filename provided by the user
 * @returns A valid filename with appropriate extension
 */
function generateFilename(mimeType: string, customFilename?: string): string {
  if (customFilename) {
    return customFilename;
  }

  const extension = getFileExtension(mimeType);
  const timestamp = Date.now();
  return `audio_${timestamp}.${extension}`;
}

/**
 * Validates ASR configuration
 * 
 * @throws {Error} If required configuration is missing
 */
function validateAsrConfig(): void {
  if (!config.asr.gatewayUrl) {
    throw new Error("ASR Gateway URL not configured");
  }

  if (!config.asr.apiKey) {
    throw new Error("ASR API key not configured");
  }
}

/**
 * Extracts error message from axios error
 * 
 * @param error - The error object from axios
 * @returns A formatted error message
 */
function extractErrorMessage(error: any): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error.message || "Unknown error occurred";
}

/**
 * Validates if a given MIME type is a supported audio format
 * 
 * @param mimeType - The MIME type to validate
 * @returns True if the MIME type is a supported audio format
 * 
 * @example
 * ```typescript
 * isAudioMimeType("audio/ogg"); // true
 * isAudioMimeType("video/mp4"); // false
 * isAudioMimeType(""); // false
 * ```
 */
export function isAudioMimeType(mimeType: string): boolean {
  if (!mimeType) {
    return false;
  }

  const normalizedMimeType = mimeType.toLowerCase();

  return (
    normalizedMimeType.startsWith("audio/") ||
    SUPPORTED_AUDIO_MIME_TYPES.includes(normalizedMimeType as any)
  );
}

/**
 * Transcribes audio using the Go AI Gateway ASR service and translates it to English.
 * 
 * This function performs the following steps:
 * 1. Validates ASR configuration
 * 2. Converts base64 audio to buffer
 * 3. Sends audio to transcription service (Krio)
 * 4. Translates transcribed Krio text to English
 * 5. Returns the translated English text
 * 
 * @param audioBase64 - Base64 encoded audio data
 * @param mimeType - MIME type of the audio (e.g., "audio/ogg")
 * @param filename - Optional custom filename for the audio file
 * @returns Translated English text
 * 
 * @throws {Error} If ASR configuration is missing
 * @throws {Error} If transcription fails
 * @throws {Error} If translation fails
 * @throws {Error} If response is empty or invalid
 * 
 * @example
 * ```typescript
 * const text = await transcribeAudio(
 *   base64AudioData,
 *   "audio/ogg",
 *   "voice_message.ogg"
 * );
 * console.log(text); // "Hello, how are you?"
 * ```
 */
export async function transcribeAudio(
  audioBase64: string,
  mimeType: string,
  filename?: string
): Promise<string> {
  try {
    validateAsrConfig();

    const gatewayUrl = config.asr.gatewayUrl;
    const apiKey = config.asr.apiKey;

    const audioBuffer = Buffer.from(audioBase64, "base64");

    const finalFilename = generateFilename(mimeType, filename);

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
        audioSize: audioBuffer.length,
      },
      "Sending audio to ASR Gateway for transcription"
    );

    const response = await axios.post<TranscriptionResponse>(
      `${gatewayUrl}/api/v1/transcribe`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "X-API-Key": apiKey,
        },
        timeout: API_TIMEOUT_MS,
      }
    );


    const krioText = response.data.krio_text;

    if (!krioText || !krioText.trim()) {
      logger.warn(
        { response: response.data },
        "Empty or invalid transcription response"
      );
      throw new Error("Empty transcription response from ASR service");
    }

    logger.info(
      {
        krioTextLength: krioText.length,
      },
      "Audio transcribed successfully, sending for translation"
    );

    const translationRequest: TranslationRequest = {
      text: krioText,
      source_lang: "kri",
      target_lang: "en",
    };

    const trl_response = await axios.post<TranslationResponse>(
      `${gatewayUrl}/api/v1/translate`,
      translationRequest,
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        timeout: API_TIMEOUT_MS,
      }
    );

    const transcribedText = trl_response.data?.translated_text;

    if (!transcribedText) {
      logger.warn(
        { response: trl_response.data },
        "Empty or invalid translation response"
      );
      throw new Error("Empty translation response from translation service");
    }

    logger.info(
      {
        transcribedLength: transcribedText.length,
      },
      "Audio transcribed and translated successfully"
    );

    return transcribedText;
  } catch (error: any) {
    const errorMessage = extractErrorMessage(error);
    const statusCode = axios.isAxiosError(error)
      ? error.response?.status
      : undefined;

    logger.error(
      {
        error: errorMessage,
        statusCode,
      },
      "Failed to transcribe and translate audio"
    );

    throw new Error(`Transcription failed: ${errorMessage}`);
  }
}