import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set")
  }

  const sslConfig = process.env.DATABASE_CA_CERT
    ? { rejectUnauthorized: true, ca: process.env.DATABASE_CA_CERT }
    : undefined

  const parsed = new URL(connectionString)
  const adapter = new PrismaPg({
    host: parsed.hostname,
    port: parsed.port ? parseInt(parsed.port, 10) : 5432,
    database: parsed.pathname.replace(/^\//, ""),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    ssl: sslConfig,
  })
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
