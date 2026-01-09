import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3800", 10),
  
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    visionModel: process.env.OPENAI_VISION_MODEL || "gpt-4o",
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
  },
  
  ai: {
    similarityThreshold: parseFloat(process.env.SIMILARITY_THRESHOLD || "0.8"),
    enableVisionAnalysis: process.env.ENABLE_VISION_ANALYSIS !== "false",
    enableDuplicateDetection: process.env.ENABLE_DUPLICATE_DETECTION !== "false",
  },
  
  whatsapp: {
    serverUrl: process.env.WHATSAPP_SERVER_URL || "http://localhost:3700",
    apiKey: process.env.WHATSAPP_API_KEY || "",
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || "crowdsource_verify_token",
  },
  
  agent: {
    apiKey: process.env.AGENT_API_KEY || "",
  },
  
  database: {
    url: process.env.DATABASE_URL || "",
  },
  
  brandName: process.env.BRAND_NAME || "Crowdsource Agent",
  
  asr: {
    gatewayUrl: process.env.ASR_GATEWAY_URL || "",
    apiKey: process.env.ASR_API_KEY || "",
  },
  
  webAppUrl: process.env.WEB_APP_URL || "",
};

// Validate required config
const requiredEnvVars = [
  "OPENAI_API_KEY",
  "WHATSAPP_SERVER_URL",
  "WHATSAPP_API_KEY",
  "AGENT_API_KEY",
  "DATABASE_URL",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
