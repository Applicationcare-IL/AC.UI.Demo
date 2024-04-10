import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default defineConfig(
  mergeConfig(viteConfig, {
    // extending app vite config
    test: {
      setupFiles: ["tests/unit.setup.js"],
      globals: true,
      environment: "happy-dom",
    },
  })
);
