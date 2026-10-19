// Rasterizes public/favicon.svg into favicon.ico, and the hero's "b" (BinalisSymbol.astro) into apple-touch-icon.png
// and the Open Graph image og-image.png (the card shown when the site is shared on WhatsApp or social networks).
// Run after editing either, or the headline: pnpm icons (needs `pnpm exec playwright install chromium` once).
import { Buffer } from "node:buffer";
import { readFile, writeFile } from "node:fs/promises";
import { URL } from "node:url";
import { chromium } from "@playwright/test";

const publicDir = new URL("../public/", import.meta.url);
const faviconSvg = await readFile(new URL("favicon.svg", publicDir), "utf8");
const symbolSource = await readFile(
  new URL("../src/components/BinalisSymbol.astro", import.meta.url),
  "utf8",
);
const symbolSvg = symbolSource.match(/<svg[\s\S]*<\/svg>/)[0];
const heroSource = await readFile(
  new URL("../src/components/Hero.astro", import.meta.url),
  "utf8",
);
// Plain text: the h1 may wrap words in styling tags.
const headline = heroSource
  .match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]
  .replace(/<[^>]+>/g, "")
  .replace(/[<>]/g, "")
  .replace(/\s+/g, " ")
  .trim();
const fontsDir = new URL("../src/assets/fonts/", import.meta.url);
// setContent pages have no origin to load font files from: they go in as data: URIs.
const fontFace = async (family, file) =>
  `@font-face { font-family: "${family}"; font-weight: 100 900; src: url(data:font/woff2;base64,${(
    await readFile(new URL(file, fontsDir))
  ).toString("base64")}) format("woff2"); }`;

const ICO_SIZES = [16, 32, 48];
const APPLE_SIZE = 180;
// The "b" ends up 82 px tall: room for the glow and iOS's rounded corners.
const APPLE_SVG_HEIGHT = 96;
// The hero's resting glow scaled down to the symbol's size in the 180 px tile.
const APPLE_GLOW = "drop-shadow(0 0 3px rgb(0 240 255 / 35%))";
// The brand tokens the symbol reads from global.css.
const BRAND_COLORS =
  ":root { --color-cyan: #00f0ff; --color-violet: #7b5cff; }";
// The size WhatsApp, Facebook and LinkedIn crop to without losing edges.
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const browser = await chromium.launch();
const page = await browser.newPage();

async function render(size, html, css, height = size) {
  await page.setViewportSize({ width: size, height });
  await page.setContent(
    `<style>html, body { margin: 0; height: 100%; } svg { display: block; } ${css}</style>${html}`,
  );
  // A string runs in the page, where document exists (this file is linted as Node code).
  await page.evaluate("document.fonts.ready");
  return page.screenshot({ omitBackground: true });
}

// ICO with embedded PNGs: 6-byte header, one 16-byte entry per image, then the PNG data.
function toIco(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, png }, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size, entry);
    header.writeUInt8(size, entry + 1);
    header.writeUInt16LE(1, entry + 4); // color planes
    header.writeUInt16LE(32, entry + 6); // bits per pixel
    header.writeUInt32LE(png.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...images.map(({ png }) => png)]);
}

try {
  const icoImages = [];
  for (const size of ICO_SIZES) {
    const png = await render(
      size,
      faviconSvg,
      `svg { width: ${size}px; height: ${size}px; }`,
    );
    icoImages.push({ size, png });
  }
  await writeFile(new URL("favicon.ico", publicDir), toIco(icoImages));

  // Opaque square: iOS paints transparency black and applies its own mask.
  const applePng = await render(
    APPLE_SIZE,
    symbolSvg,
    `${BRAND_COLORS}
     body { display: grid; place-items: center; background: #0d1220; }
     svg { height: ${APPLE_SVG_HEIGHT}px; filter: ${APPLE_GLOW}; }`,
  );
  await writeFile(new URL("apple-touch-icon.png", publicDir), applePng);

  const ogPng = await render(
    OG_WIDTH,
    `${symbolSvg}
     <div>
       <p class="wordmark">bin<span>alis</span></p>
       <p class="headline">${headline}</p>
       <p class="domain">binalis.com.py</p>
     </div>`,
    `${BRAND_COLORS}
     ${await fontFace("Space Grotesk", "space-grotesk-latin-wght-normal.woff2")}
     ${await fontFace("JetBrains Mono", "jetbrains-mono-latin-wght-normal.woff2")}
     body { display: flex; align-items: center; gap: 72px; padding: 0 96px; box-sizing: border-box;
            background: #06080f; color: #e8ecf7; font-family: "Space Grotesk"; }
     svg { flex: none; height: 300px; filter: drop-shadow(0 0 16px rgb(0 240 255 / 45%)); }
     p { margin: 0; }
     .wordmark { font-size: 64px; font-weight: 700; letter-spacing: -0.02em; }
     .wordmark span { color: #00f0ff; }
     .headline { margin-top: 24px; font-size: 54px; font-weight: 700; line-height: 1.1; letter-spacing: -0.03em; }
     .domain { margin-top: 32px; color: #8a94b0; font-family: "JetBrains Mono"; font-size: 26px; }`,
    OG_HEIGHT,
  );
  await writeFile(new URL("og-image.png", publicDir), ogPng);
} finally {
  await browser.close();
}
