import type { PrismaClient } from "@prisma/client";

export interface ToolContext {
  prisma: PrismaClient;
  currentUserPhone: string;
  currentLocationContext?: {
    hasLocation?: boolean;
    latitude?: number;
    longitude?: number;
    locationDescription?: string;
  };
  sendWhatsAppMessage: (phoneE164: string, message: string) => Promise<void>;
}

export interface ToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, any>;
      required?: string[];
    };
  };
}

export type ToolHandler = (args: any, context: ToolContext) => Promise<any>;
