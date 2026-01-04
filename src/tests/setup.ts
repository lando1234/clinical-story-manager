/**
 * Test Setup - Vitest global setup file
 *
 * Initializes test database connection and provides cleanup utilities.
 * This file is loaded before all tests via vitest.config.ts setupFiles.
 */

// Load environment variables from .env.test first
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.test file if it exists, otherwise fall back to .env
config({ path: resolve(process.cwd(), ".env.test") });
config({ path: resolve(process.cwd(), ".env") });

import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { beforeAll, afterAll, beforeEach } from "vitest";

// Determine if SSL is needed based on DATABASE_URL
const databaseUrl = process.env.DATABASE_URL ?? "";
const needsSSL = databaseUrl.includes("sslmode") || 
                 databaseUrl.includes("neon.tech") || 
                 (!databaseUrl.includes("localhost") && !databaseUrl.includes("127.0.0.1"));

// Create connection pool for tests with conditional SSL support
const testPool = new Pool({
  connectionString: databaseUrl,
  ...(needsSSL && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
});

// Create Prisma adapter
const adapter = new PrismaPg(testPool);

// Create a dedicated Prisma client for tests
// Uses DATABASE_URL from environment (should point to test database)
export const testPrisma = new PrismaClient({
  adapter,
  log: process.env.DEBUG_PRISMA ? ["query", "info", "warn", "error"] : ["error"],
});

/**
 * Cleans all test data from the database.
 * Order matters due to foreign key constraints.
 */
export async function cleanupTestData(): Promise<void> {
  // Delete in reverse order of dependencies
  await testPrisma.clinicalEvent.deleteMany({});
  await testPrisma.addendum.deleteMany({});
  await testPrisma.note.deleteMany({});
  await testPrisma.medication.deleteMany({});
  await testPrisma.psychiatricHistory.deleteMany({});
  await testPrisma.appointment.deleteMany({});
  await testPrisma.clinicalRecord.deleteMany({});
  await testPrisma.patient.deleteMany({});
}

// Global setup - runs once before all tests
beforeAll(async () => {
  // Connect to test database
  await testPrisma.$connect();

  // Verify we're connected to a test database (safety check)
  const databaseUrl = process.env.DATABASE_URL ?? "";
  if (!databaseUrl.includes("test") && !databaseUrl.includes("localhost")) {
    console.warn(
      "WARNING: DATABASE_URL may not be pointing to a test database. " +
        "Ensure you are using a separate test database."
    );
  }

  // Clean up any leftover data from previous test runs
  await cleanupTestData();
});

// Cleanup before each test to ensure isolation
beforeEach(async () => {
  await cleanupTestData();
});

// Global teardown - runs once after all tests
afterAll(async () => {
  // Clean up test data
  await cleanupTestData();

  // Disconnect from database
  await testPrisma.$disconnect();
});

// Re-export Prisma types for convenience
export { PrismaClient };
