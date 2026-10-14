import { readFileSync } from "node:fs";
import process from "node:process";
import { defineConfig } from "astro/config";

// astro preview ignores public/_headers: it gets production's CSP here so the e2e tests run under it.
// Not in dev, where Vite's client needs inline scripts.
const csp = readFileSync("public/_headers", "utf8").match(
  /^\s*Content-Security-Policy:\s*(.+)$/m,
)?.[1];
if (!csp)
  throw new Error("No Content-Security-Policy found in public/_headers");
const isPreview = process.argv.includes("preview");

export default defineConfig({
  site: "https://binalis.com.py",
  // External CSS keeps the CSP free of 'unsafe-inline' (see public/_headers).
  build: { inlineStylesheets: "never" },
  // Vite inlines assets under 4 KB as data: URIs, which the CSP's font-src 'self' blocks.
  vite: { build: { assetsInlineLimit: 0 } },
  server: isPreview ? { headers: { "Content-Security-Policy": csp } } : {},
});
