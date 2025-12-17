import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // Use src/tests/setup.ts for global setup
    setupFiles: ["./src/tests/setup.ts"],
    // Environment
    environment: "node",
    // Timeouts for database operations
    testTimeout: 30000,
    hookTimeout: 30000,
    // Run tests sequentially to avoid database conflicts
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Include test files
    include: ["src/tests/**/*.test.ts"],
    // Global test utilities
    globals: true,
  },
});
