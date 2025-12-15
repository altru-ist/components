import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";

const entry = path.resolve(__dirname, "src/main.ts");
const designTokensSrc = path.resolve(__dirname, "src/design-tokens.css");
const designTokensDest = path.resolve(__dirname, "dist/design-tokens.css");

// Plugin to process design-tokens.css through Tailwind and output to dist
const processDesignTokens = (): Plugin => {
  let processedCss: string | null = null;

  return {
    name: "process-design-tokens",
    enforce: "post",
    // Transform the CSS file to process it through Tailwind
    transform(code, id) {
      if (id === designTokensSrc || id.endsWith("design-tokens.css")) {
        // Return the code to be processed by Tailwind plugin
        return { code, map: null };
      }
    },
    // Capture the processed CSS from the build output
    generateBundle(_options, bundle) {
      // Look for the processed CSS in the bundle
      for (const [fileName, chunkOrAsset] of Object.entries(bundle)) {
        if (
          fileName.includes("design-tokens") &&
          chunkOrAsset.type === "asset" &&
          fileName.endsWith(".css")
        ) {
          processedCss = chunkOrAsset.source as string;
          // Update the asset to ensure it's named correctly in dist root
          if (fileName !== "design-tokens.css") {
            delete bundle[fileName];
            const asset = chunkOrAsset as typeof chunkOrAsset & {
              fileName: string;
            };
            asset.fileName = "design-tokens.css";
            bundle["design-tokens.css"] = asset;
          }
          break;
        }
      }
    },
    // Fallback: ensure file is written even if not in bundle
    writeBundle() {
      if (!processedCss && existsSync(designTokensSrc)) {
        // If not processed, copy source (shouldn't happen, but fallback)
        const source = readFileSync(designTokensSrc, "utf-8");
        writeFileSync(designTokensDest, source);
      } else if (processedCss) {
        writeFileSync(designTokensDest, processedCss);
      }
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    libInjectCss(),
    processDesignTokens(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.app.json",
      exclude: ["src/volt/**/*"],
    }),
  ],
  build: {
    lib: {
      entry,
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue", "primevue", /^primevue\/.*/],
      // Add design-tokens.css as an additional input to process it through Tailwind
      input: existsSync(designTokensSrc)
        ? {
            main: entry,
            "design-tokens": designTokensSrc,
          }
        : entry,
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: () => {
          // CSS files will be handled as assets, not chunks
          return "[name].js";
        },
        assetFileNames: (assetInfo) => {
          // Keep CSS files in dist root with their original names
          if (assetInfo.name?.endsWith(".css")) {
            return "[name].[ext]";
          }
          return "assets/[name].[ext]";
        },
      },
    },
  },
});
