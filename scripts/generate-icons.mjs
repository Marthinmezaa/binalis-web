// Rasterizes public/favicon.svg (the single source) into favicon.ico and apple-touch-icon.png.
// Run after editing the SVG: pnpm icons (needs `pnpm exec playwright install chromium` once).
import { Buffer } from "node:buffer";
import { readFile, writeFile } from "node:fs/promises";
import { URL } from "node:url";
import { chromium } from "@playwright/test";

const publicDir = new URL("../public/", import.meta.url);
const svg = await readFile(new URL("favicon.svg", publicDir), "utf8");

const ICO_SIZES = [16, 32, 48];
const APPLE_SIZE = 180;
// Leaves room for the glow; iOS rounds the corners itself.
const APPLE_SVG_SIZE = 150;
// The hero's glow (BinalisSymbol.astro) scaled down to the symbol's size in the 180 px tile.
const APPLE_GLOW =
  "drop-shadow(0 0 5px rgb(0 240 255 / 55%)) drop-shadow(0 0 15px rgb(123 92 255 / 45%))";

const browser = await chromium.launch();
const page = await browser.newPage();

async function render(size, css) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<style>html, body { margin: 0; height: 100%; } svg { display: block; } ${css}</style>${svg}`,
  );
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
      `svg { width: ${size}px; height: ${size}px; }`,
    );
    icoImages.push({ size, png });
  }
  await writeFile(new URL("favicon.ico", publicDir), toIco(icoImages));

  // Opaque square: iOS paints transparency black and applies its own mask.
  const applePng = await render(
    APPLE_SIZE,
    `body { display: grid; place-items: center; background: #06080f; }
     svg { width: ${APPLE_SVG_SIZE}px; height: ${APPLE_SVG_SIZE}px; filter: ${APPLE_GLOW}; }
     #fondo { display: none; }`,
  );
  await writeFile(new URL("apple-touch-icon.png", publicDir), applePng);
} finally {
  await browser.close();
}
