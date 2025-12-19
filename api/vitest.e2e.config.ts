import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/e2e/**/*.e2e-spec.ts"],
    setupFiles: ["./tests/setup/e2e-setup.ts"],
    testTimeout: 20000,
    hookTimeout: 20000, // E2E geralmente demora mais
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
