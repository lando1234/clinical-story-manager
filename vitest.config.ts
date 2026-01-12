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
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: [
        // Generated / tooling
        "src/generated/prisma/**",
        "prisma/models/**",
        "scripts/**",
        ".next/**",
        "next.config.ts",
        "postcss.config.mjs",
        "prisma.config.ts",
        "vitest.config.ts",
        // App Router + UI (se cubrirá en etapa posterior)
        "src/app/**",
        "src/ui/**",
        // Static data / mocks
        "src/data/mock.ts",
        "src/data/patient-data.ts",
        // Test harness & fixtures
        "src/tests/**",
        // Pure types without logic
        "src/types/**",
      ],
    },
  },
});
