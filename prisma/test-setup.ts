/**
 * Test Database Setup Script
 *
 * This script applies migrations to the test database.
 * Run with: npm run test:db:setup
 *
 * Requires DATABASE_URL environment variable to point to test database.
 */

import { execSync } from "child_process";

async function main() {
  console.log("Setting up test database...");

  try {
    // Apply migrations to test database
    execSync("npx prisma migrate deploy", {
      stdio: "inherit",
      env: {
        ...process.env,
        // Ensure we're using the test database URL
        DATABASE_URL: process.env.DATABASE_URL,
      },
    });

    console.log("Test database setup complete.");
  } catch (error) {
    console.error("Failed to setup test database:", error);
    process.exit(1);
  }
}

main();
