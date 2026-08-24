import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin, type ResolvedConfig } from "vite";

function listFiles(directory: string, root = directory): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    return entry.isDirectory()
      ? listFiles(absolutePath, root)
      : [path.relative(root, absolutePath).split(path.sep).join("/")];
  });
}

function offlineAppPlugin(): Plugin {
  let config: ResolvedConfig;

  return {
    name: "la-sfida-offline-app",
    apply: "build",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    closeBundle() {
      const outputDirectory = path.resolve(config.root, config.build.outDir);
      const files = listFiles(outputDirectory).filter((file) => file !== "sw.js");
      const versionHash = createHash("sha256");

      for (const file of files) {
        versionHash.update(file);
        versionHash.update(readFileSync(path.join(outputDirectory, file)));
      }

      const cacheVersion = versionHash.digest("hex").slice(0, 12);
      const precacheFiles = files.map((file) => `./${file}`);
      const serviceWorker = `const CACHE_PREFIX = "la-sfida-";
const CACHE_NAME = CACHE_PREFIX + "${cacheVersion}";
const PRECACHE_FILES = ${JSON.stringify(precacheFiles, null, 2)};
const APP_INDEX = new URL("./index.html", self.registration.scope).href;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll(
          PRECACHE_FILES.map(
            (file) => new URL(file, self.registration.scope).href,
          ),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter(
              (name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME,
            )
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(APP_INDEX, copy));
          }
          return response;
        })
        .catch(() => caches.match(APP_INDEX)),
    );
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
`;

      writeFileSync(path.join(outputDirectory, "sw.js"), serviceWorker);
    },
  };
}

export default defineConfig({
  base: process.env.BASE_PATH || "./",
  plugins: [react(), tailwindcss(), offlineAppPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
