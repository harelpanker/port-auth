import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cssInjectedByJsPlugin()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.tsx"),
      name: "PortAuth",
      fileName: () => "port-auth.js",
      formats: ["iife"],
    },
    sourcemap: false,
    minify: "esbuild",
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  }
})
