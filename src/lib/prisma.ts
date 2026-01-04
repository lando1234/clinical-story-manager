import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// PrismaClient singleton for use across the application
// Prevents multiple instances during development hot reloading

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Determine if SSL is needed based on DATABASE_URL
const databaseUrl = process.env.DATABASE_URL ?? "";
const needsSSL = databaseUrl.includes("sslmode") || 
                 databaseUrl.includes("neon.tech") || 
                 (!databaseUrl.includes("localhost") && !databaseUrl.includes("127.0.0.1"));

// Create connection pool with conditional SSL support
const pool = globalForPrisma.pool ?? new Pool({
  connectionString: databaseUrl,
  ...(needsSSL && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}
