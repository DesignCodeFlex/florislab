import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@landing": path.resolve(__dirname, "./src/landing"),
      "@user": path.resolve(__dirname, "./src/user"),
      "@admin": path.resolve(__dirname, "./src/admin"),
      "@routes": path.resolve(__dirname, "./src/routes"),
    },
  },
  server: {
    historyApiFallback: true,
  },
});
