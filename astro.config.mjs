import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://binalis.com.py",
  // External CSS keeps the CSP free of 'unsafe-inline' (see public/_headers).
  build: { inlineStylesheets: "never" },
});
