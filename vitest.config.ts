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
