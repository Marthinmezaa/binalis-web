// Rasterizes public/favicon.svg into favicon.ico, and the hero's "b" (BinalisSymbol.astro) into apple-touch-icon.png.
// Run after editing either: pnpm icons (needs `pnpm exec playwright install chromium` once).
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

const ICO_SIZES = [16, 32, 48];
const APPLE_SIZE = 180;
// The "b" ends up 82 px tall: room for the glow and iOS's rounded corners.
const APPLE_SVG_HEIGHT = 96;
// The hero's resting glow scaled down to the symbol's size in the 180 px tile.
const APPLE_GLOW = "drop-shadow(0 0 3px rgb(0 240 255 / 35%))";
// The brand tokens the symbol reads from global.css.
const BRAND_COLORS =
  ":root { --color-cyan: #00f0ff; --color-violet: #7b5cff; }";

const browser = await chromium.launch();
const page = await browser.newPage();

async function render(size, svg, css) {
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
} finally {
  await browser.close();
}
