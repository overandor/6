import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true
  },
  css: {
    postcss: {
      plugins: []
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, ".")
    }
  },
  plugins: [
    {
      name: "css-stub",
      enforce: "pre",
      resolveId(id: string) {
        if (id.endsWith(".css")) return id;
      },
      load(id: string) {
        if (id.endsWith(".css")) return "export default {}";
      }
    }
  ]
});
