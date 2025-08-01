import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "0.0.0.0",
    hmr: {
      clientPort: 443,
      host: "3000-rrsartneoai-ocrailaw-liwp9u8ho0q.ws-eu120.gitpod.io",
      protocol: "wss"
    }
  }
});
