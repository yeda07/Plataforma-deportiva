import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    exclude: [".next/**", "dist/**", "e2e/**", "node_modules/**", "playwright-report/**", "test-results/**"],
    setupFiles: ["./vitest.setup.ts"]
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@components": path.resolve(import.meta.dirname, "./src/components/index.ts"),
      "@features": path.resolve(import.meta.dirname, "./src/features/index.ts"),
      "@lib": path.resolve(import.meta.dirname, "./src/lib/env.ts")
    }
  }
});
