import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const sslConfig = process.env.DATABASE_CA_CERT
    ? { rejectUnauthorized: true, ca: process.env.DATABASE_CA_CERT }
    : undefined;
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    ssl: sslConfig,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
