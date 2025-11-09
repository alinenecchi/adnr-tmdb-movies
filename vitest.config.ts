import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    // Show detailed output for failed tests
    outputFile: {
      json: "./coverage/test-results.json",
    },
    // Reporters to show test failures clearly
    reporters: ["verbose"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov", "json-summary"],
      // Always report coverage even when tests fail
      reportOnFailure: true,
      // Show which files have low coverage
      excludeAfterRemap: false,
      all: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/vite-env.d.ts",
        "**/*.config.ts",
        "src/main.tsx",
        "src/App.tsx",
        "src/utils/**",
        "src/pages/Showcase/**", // Demo page
        "src/services/api/tmdb.ts", // Axios configuration (interceptors)
      ],
      // Fail the build if coverage thresholds are not met
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      // Show coverage even when tests fail
      allowExternal: false,
      // Include coverage for files with failed tests
      skipFull: false,
      watermarks: {
        statements: [80, 95],
        functions: [80, 95],
        branches: [80, 95],
        lines: [80, 95],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/atoms": path.resolve(__dirname, "./src/components/atoms"),
      "@/molecules": path.resolve(__dirname, "./src/components/molecules"),
      "@/organisms": path.resolve(__dirname, "./src/components/organisms"),
      "@/templates": path.resolve(__dirname, "./src/components/templates"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/contexts": path.resolve(__dirname, "./src/contexts"),
      "@/services": path.resolve(__dirname, "./src/services"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/styles": path.resolve(__dirname, "./src/styles"),
    },
  },
});
