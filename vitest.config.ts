import {defineConfig} from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    coverage: {
      exclude: [
        ".next/**",
        "coverage/**",
        "docs/**",
        "next-env.d.ts",
        "out/**",
        "**/*.config.*",
        "**/*.test.*",
        "tests/**",
      ],
      include: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.ts", "providers/**/*.tsx", "types/**/*.ts"],
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage",
      thresholds: {
        branches: 60,
        functions: 60,
        lines: 70,
        statements: 70,
      },
    },
    css: false,
    environment: "jsdom",
    globals: true,
    maxWorkers: 1,
    pool: "threads",
    setupFiles: ["./tests/setup.ts"],
  },
});
