import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://binalis.com.py",
  // External CSS keeps the CSP free of 'unsafe-inline' (see public/_headers).
  build: { inlineStylesheets: "never" },
  // Vite inlines assets under 4 KB as data: URIs, which the CSP's font-src 'self' blocks.
  vite: { build: { assetsInlineLimit: 0 } },
});
