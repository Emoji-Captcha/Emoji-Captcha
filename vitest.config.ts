/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    reporters: ["json", "default"],
    outputFile: "./test-report.json",
    watch: false,
  },
});
