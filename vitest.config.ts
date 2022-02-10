/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    reporters: ["json", "verbose"],
    outputFile: "./test-report.json",
  },
});
