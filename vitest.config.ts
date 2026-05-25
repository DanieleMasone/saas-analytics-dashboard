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
        branches: 75,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
    css: false,
    environment: "jsdom",
    globals: true,
    include: ["app/**/*.test.{ts,tsx}", "components/**/*.test.{ts,tsx}", "lib/**/*.test.ts", "providers/**/*.test.tsx"],
    maxWorkers: 1,
    pool: "threads",
    setupFiles: ["./tests/setup.ts"],
  },
});
