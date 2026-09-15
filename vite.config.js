import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,woff2}"],
        navigateFallback: "index.html",
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      manifest: {
        name: "Flashcards Online",
        short_name: "Flashcards",
        description: "Tanulókártyák böngészőben, Google Drive mentéssel.",
        lang: "hu",
        start_url: "./",
        scope: "./",
        display: "standalone",
        orientation: "any",
        background_color: "#faf9f6",
        theme_color: "#8a1c2b",
        icons: [
          { src: "./icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "./icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          {
            src: "./icons/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
