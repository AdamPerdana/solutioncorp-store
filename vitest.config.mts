import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true, // vite bisa resolve path alias dari tsconfig.json
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});