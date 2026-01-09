import express, { Request, Response, NextFunction } from "express";
import { logger } from "./logger";
import { config } from "./config";
import { CrowdsourceAgent } from "./crowdsource-agent";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import path from "path";
import ministryRoutes from "./routes/ministry";
import aiRoutes from "./routes/ai-routes";
import geoRoutes from "./routes/geo-routes";
import { transcribeAudio, isAudioMimeType } from "./services/audio-transcription";

const app = express();
// Increased limit to 10MB to handle base64-encoded images from WhatsApp
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true
}));

let agent: CrowdsourceAgent;

// Message deduplication cache - stores message hashes with timestamps
const processedMessages = new Map<string, number>();
const MESSAGE_DEDUP_WINDOW_MS = 10000; // 10 seconds window

// Generate a simple hash for message deduplication
function generateMessageHash(phone: string, message: string, timestamp?: number): string {
  // Combine phone + message content for deduplication
  // If no timestamp, use message content only to catch very close duplicates
  const content = `${phone}:${message}`;
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
}

// Clean up old entries from the deduplication cache
function cleanupDeduplicationCache(): void {
  const now = Date.now();
  for (const [hash, timestamp] of processedMessages.entries()) {
    if (now - timestamp > MESSAGE_DEDUP_WINDOW_MS) {
      processedMessages.delete(hash);
    }
  }
}

// Run cleanup every 30 seconds
setInterval(cleanupDeduplicationCache, 30000);

// Helper to detect if string is base64 or binary data
function isBinaryOrBase64(str: string): boolean {
  if (!str || str.length < 50) return false;
  
  // Check if it looks like base64 (starts with common JPEG/image headers)
  if (str.startsWith('/9j/') || str.startsWith('iVBORw') || str.startsWith('R0lGOD')) {
    return true;
  }
  
  // Check if mostly non-printable characters
  const nonPrintable = str.split('').filter(c => {
    const code = c.charCodeAt(0);
    return code < 32 || code > 126;
  }).length;
  
  return nonPrintable / str.length > 0.3;
}

// Initialize agent
(async () => {
  try {
    agent = new CrowdsourceAgent();
    await agent.initialize();
    logger.info("Crowdsource Agent initialized successfully");
  } catch (error) {
    logger.error({ error }, "Failed to initialize agent");
    process.exit(1);
  }
})();

// API key middleware
function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKeyHeader = req.headers["x-api-key"] as string | undefined;
  const apiKeyQuery = typeof req.query.api_key === "string" ? (req.query.api_key as string) : undefined;
  const expected = config.agent.apiKey;

  if (!apiKeyHeader && !apiKeyQuery) {
    return res.status(401).json({ error: "Unauthorized: API key is required" }) as any;
  }

  if (apiKeyHeader !== expected && apiKeyQuery !== expected) {
    return res.status(401).json({ error: "Unauthorized: Invalid API key" }) as any;
  }

  next();
}

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Ministry dashboard routes
app.use("/api/ministry", ministryRoutes);

// AI categorization routes
app.use("/api", aiRoutes);

// Geographic features routes
app.use("/api/geo", geoRoutes);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    service: "crowdsource-agent",
    activeConversations: agent ? agent.getActiveConversationsCount() : 0,
  });
});

app.get("/healthz", (req: Request, res: Response) => {
  res.status(200).send("ok");
});

// Clear conversation history for a user
app.delete("/api/v1/conversation/:phone", requireApiKey, (req: Request, res: Response) => {
  const phone = req.params.phone;

  if (!agent) {
    return res.status(503).json({ error: "Agent not initialized" }) as any;
  }

  const cleared = agent.clearUserConversation(phone);

  if (cleared) {
    return res.json({
      success: true,
      message: `Conversation history cleared for ${phone}`,
    }) as any;
  } else {
    return res.status(404).json({
      success: false,
      message: `No conversation found for ${phone}`,
    }) as any;
  }
});

// WhatsApp webhook verification (GET)
app.get("/webhook/whatsapp", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  logger.info({ mode, token, challenge }, "Webhook verification request");

  if (mode === "subscribe" && token === config.whatsapp.verifyToken) {
    logger.info("Webhook verified successfully");
    res.status(200).send(challenge);
  } else {
    logger.warn("Webhook verification failed");
    res.sendStatus(403);
  }
});

// External WhatsApp client webhook (POST)
app.post("/webhook/whatsapp", requireApiKey, async (req: Request, res: Response) => {
  try {
    const { event, message, from, phoneE164, messageType, location, media } = req.body;

    logger.info({ event, from, phoneE164, message }, "Received WhatsApp message");

    // Handle different events
    if (event === "connected") {
      return res.json({ status: "success", message: "Client connected" }) as any;
    }

    if (event === "disconnected") {
      return res.json({ status: "success", message: "Client disconnected" }) as any;
    }

    if (event === "message") {
      // Extract phone number from JID if needed
      let phone = phoneE164;
      if (!phone && from && from.includes("@c.us")) {
        const phoneNumber = from.split("@")[0];
        phone = `+${phoneNumber}`;
      }

      if (!phone) {
        return res.status(400).json({ error: "Phone number required" }) as any;
      }

      // Deduplication check - prevent processing the same message twice
      const messageContent = message || (messageType === "location" ? `location:${location?.latitude}:${location?.longitude}` : "");
      const messageHash = generateMessageHash(phone, messageContent);
      
      if (processedMessages.has(messageHash)) {
        logger.info({ phone, messageHash }, "Duplicate message detected, skipping");
        return res.json({
          answer: null,
          status: "duplicate"
        }) as any;
      }
      
      // Mark message as being processed
      processedMessages.set(messageHash, Date.now());

      // Handle location shares from WhatsApp
      let locationContext;
      if (messageType === "location" && location) {
        logger.info(
          {
            phone,
            latitude: location.latitude,
            longitude: location.longitude,
            description: location.description,
          },
          "Location share received"
        );

        // Filter out binary/base64 data from description
        const cleanDescription = (location.description && !isBinaryOrBase64(location.description)) 
          ? location.description 
          : (location.address && !isBinaryOrBase64(location.address))
            ? location.address
            : null;

        locationContext = {
          hasLocation: true,
          latitude: location.latitude,
          longitude: location.longitude,
          locationDescription: cleanDescription,
        };

        // Auto-trigger problem report flow with location
        // We append the coordinates to the message so they are preserved in the conversation history
        // This allows the LLM to extract them if the user describes the problem in a subsequent message
        const locationMessage =
          message 
            ? `${message} \n[System: Location shared: ${location.latitude}, ${location.longitude}]`
            : `I'm sharing my location to report a problem. \n[System: Location shared: ${location.latitude}, ${location.longitude}]`;
        const response = await agent.processMessage(locationMessage, phone, locationContext);

        return res.json({
          answer: response,
          status: "success",
        }) as any;
      }

      // Handle media attachments (BEFORE empty message check - audio messages have empty body)
      let mediaContext;
      let processedMessage = message || "";
      
      if (media && media.data) {
        logger.info(
          {
            phone,
            mimeType: media.mimetype,
            size: media.size,
            filename: media.filename
          },
          "Media attachment received"
        );
        
        // Check if this is an audio message and transcribe it
        if (isAudioMimeType(media.mimetype) || messageType === "ptt" || messageType === "audio") {
          logger.info(
            { phone, mimeType: media.mimetype, messageType },
            "Audio message received, transcribing..."
          );
          
          try {
            const transcribedText = await transcribeAudio(
              media.data,
              media.mimetype,
              media.filename
            );
            
            if (transcribedText && transcribedText.trim()) {
              // Use transcribed text as the message
              processedMessage = transcribedText;
              logger.info(
                { phone, transcribedLength: transcribedText.length },
                "Audio transcribed successfully"
              );
            } else {
              logger.warn({ phone }, "Empty transcription result");
              return res.json({
                answer: "I received your voice message but couldn't understand it. Could you please try speaking more clearly, or send a text message instead?",
                status: "success",
              }) as any;
            }
          } catch (transcriptionError: any) {
            logger.error(
              { error: transcriptionError.message, phone },
              "Failed to transcribe audio"
            );
            return res.json({
              answer: "I received your voice message but couldn't transcribe it. Please try sending a text message instead, or try again.",
              status: "success",
            }) as any;
          }
        } else {
          // Non-audio media (images, etc.)
          mediaContext = {
            hasMedia: true,
            mimeType: media.mimetype,
            data: media.data,
            filename: media.filename,
            size: media.size
          };
        }
      }

      // Handle text-only messages (after audio processing, so we have transcribed text)
      // BUT: If there's media, we should still process it even without text
      if ((!processedMessage || !processedMessage.trim()) && !mediaContext) {
        return res.json({
          answer:
            "Welcome! You can report community problems or upvote existing ones by sending the problem number.\n\nYou can also share your WhatsApp location when reporting a problem.",
          status: "success",
        }) as any;
      }

      // If we have media but no message, create a descriptive message for the agent
      if ((!processedMessage || !processedMessage.trim()) && mediaContext) {
        processedMessage = "[User sent an image]";
      }

      // Process message with OpenAI Agent
      const response = await agent.processMessage(processedMessage, phone, locationContext, mediaContext);

      return res.json({
        answer: response,
        status: "success",
      }) as any;
    }

    return res.json({ status: "unknown_event" }) as any;
  } catch (error: any) {
    logger.error({ error }, "Error processing webhook");
    return res.status(500).json({
      answer: "Sorry, I encountered an error. Please try again.",
      status: "error",
    }) as any;
  }
});

// Start server
app.listen(config.port, () => {
  logger.info({ port: config.port }, `${config.brandName} server started`);
  logger.info(`Health check: http://localhost:${config.port}/health`);
  logger.info(`External WhatsApp: POST http://localhost:${config.port}/webhook/whatsapp`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});
