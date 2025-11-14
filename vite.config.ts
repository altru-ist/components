import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";

const entry = path.resolve(__dirname, "src/main.ts");

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    libInjectCss(),
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
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        assetFileNames: (assetInfo) => {
          // Keep assets in assets folder
          if (assetInfo.name?.endsWith(".css")) {
            return "[name].[ext]";
          }
          return "assets/[name].[ext]";
        },
      },
    },
  },
});
