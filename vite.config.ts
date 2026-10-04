import type { Connect, Plugin } from "vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { parseYleRss } from "./src/server/yle-rss";
import { loadWikiDay } from "./src/server/wiki-load";

const YLE_NEWS = "https://yle.fi/rss/uutiset/tuoreimmat";
const YLE_SELKO = "https://yle.fi/rss/selkouutiset";
const YLE_TTL_MS = 5 * 60 * 1000;

function yleRssPlugin(): Plugin {
  let cached: { at: number; body: string } | null = null;
  let wikiCached: { at: number; body: string } | null = null;

  const handler: Connect.NextHandleFunction = async (req, res, next) => {
    const path = req.url?.split("?")[0];
    if (path === "/api/wiki") {
      try {
        if (!wikiCached || Date.now() - wikiCached.at > YLE_TTL_MS) {
          const day = await loadWikiDay();
          wikiCached = { at: Date.now(), body: JSON.stringify(day) };
        }
        res.statusCode = 200;
        res.setHeader("content-type", "application/json; charset=utf-8");
        res.setHeader("cache-control", "no-store");
        res.end(wikiCached.body);
      } catch {
        res.statusCode = 502;
        res.setHeader("content-type", "application/json; charset=utf-8");
        res.end(JSON.stringify({ error: "wiki" }));
      }
      return;
    }
    if (path !== "/api/yle") return next();
    try {
      if (!cached || Date.now() - cached.at > YLE_TTL_MS) {
        const [newsXml, selkoXml] = await Promise.all([
          fetch(YLE_NEWS, { signal: AbortSignal.timeout(8000) }).then((response) => {
            if (!response.ok) throw new Error(String(response.status));
            return response.text();
          }),
          fetch(YLE_SELKO, { signal: AbortSignal.timeout(8000) }).then((response) => {
            if (!response.ok) throw new Error(String(response.status));
            return response.text();
          }),
        ]);
        cached = {
          at: Date.now(),
          body: JSON.stringify({
            news: parseYleRss(newsXml, 15),
            selko: parseYleRss(selkoXml, 8),
            fetchedAt: new Date().toISOString(),
          }),
        };
      }
      res.statusCode = 200;
      res.setHeader("content-type", "application/json; charset=utf-8");
      res.setHeader("cache-control", "no-store");
      res.end(cached.body);
    } catch {
      res.statusCode = 502;
      res.setHeader("content-type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: "yle" }));
    }
  };

  return {
    name: "yle-rss",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig({
  base: "/kolme/",
  plugins: [
    yleRssPlugin(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icon-192.png", "icon-512.png"],
      manifest: {
        name: "Kolme — le finnois en 90 jours",
        short_name: "Kolme",
        description:
          "Parcours de trois mois pour apprendre le finnois : conjugaisons, déclinaisons, particules et lecture.",
        theme_color: "#16352b",
        background_color: "#e7efe4",
        display: "standalone",
        lang: "fr",
        start_url: "/kolme/",
        scope: "/kolme/",
        icons: [
          { src: "/kolme/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/kolme/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/kolme/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "/kolme/index.html",
        globPatterns: ["**/*.{js,css,html,svg,png,woff,woff2}"],
      },
    }),
  ],
});
