import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: "./",
  build: {
    outDir: "dist", // default, matches Vercel static build
    assetsDir: "assets", // keeps assets in /dist/assets
    sourcemap: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
