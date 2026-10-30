import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import packageJson from "../package.json" with { type: "json" };

const WCAG_22_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

// "instant": the site's smooth scrolling would otherwise still be moving when the test reads the page.
const scrollToEnd = (page: Page) =>
  page.evaluate(async () => {
    scrollTo({ top: document.body.scrollHeight, behavior: "instant" });
    // Scroll-driven animations catch up on the next frame.
    await new Promise(requestAnimationFrame);
  });

// On phones the links live in a popover menu: open it first, as a visitor would.
const mainNav = async (page: Page) => {
  const menuButton = page.getByRole("button", { name: "Menú" });
  if (await menuButton.isVisible()) await menuButton.click();
  return page.getByRole("navigation", { name: "Principal" });
};

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

const PAGES = ["/", "/quien-soy/"];
const SITE = "https://binalis.com.py";

test("robots.txt apunta al sitemap y el sitemap lista cada página", async ({
  request,
}) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);

  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const path of PAGES) {
    expect(sitemap).toContain(`<loc>${SITE}${path}</loc>`);
  }
});

for (const path of PAGES) {
  // The preview server sends production's CSP (see astro.config.mjs).
  test(`${path}: no hay errores en consola bajo la CSP de producción`, async ({
    page,
  }) => {
    const response = await page.request.get(path);
    expect(response.headers()["content-security-policy"]).toBeTruthy();

    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);

    expect(errors).toEqual([]);
  });

  test(`${path}: no tiene violaciones de accesibilidad WCAG 2.2 AA`, async ({
    page,
  }) => {
    await page.goto(path);
    // Blocks fade in with the scroll: at the end of the page every one has finished, so contrast is measured on the final state.
    await scrollToEnd(page);
    const { violations } = await new AxeBuilder({ page })
      .withTags(WCAG_22_AA)
      .analyze();

    expect(violations).toEqual([]);
  });

  test(`${path}: no publica ningún placeholder`, async ({ page }) => {
    // Pending content is written as "[IN CAPS]" and must never be published.
    const placeholder = /\[[A-ZÁÉÍÓÚÑ]/;
    await page.goto(path);
    await expect(page.locator("body")).not.toContainText(placeholder);
    await expect(page.locator('meta[name="description"]')).not.toHaveAttribute(
      "content",
      placeholder,
    );
  });

  test(`${path}: declara su URL pública y la imagen para compartir`, async ({
    page,
    request,
  }) => {
    await page.goto(path);
    const publicUrl = `${SITE}${path}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      publicUrl,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      publicUrl,
    );

    const image = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(image).toMatch(new RegExp(`^${SITE}/`));
    expect((await request.get(new URL(image ?? "").pathname)).ok()).toBe(true);
  });

  test(`${path}: no genera scroll horizontal`, async ({ page }) => {
    await page.goto(path);
    // Not window.innerWidth: mobile browsers zoom out to fit overflowing content, so it grows with it.
    const overflows = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );

    expect(overflows).toBe(false);
  });
}

test("el primer foco es 'Saltar al contenido' y lleva al contenido", async ({
  page,
}) => {
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(skipLink).toBeFocused();

  await expect(skipLink).toHaveAttribute("href", "#contenido");
});

test("un link interno lleva a su sección sin dejar el ancla en la dirección", async ({
  page,
}) => {
  // Otherwise phones reopen the tab at "/#cotizacion", at the bottom of the page.
  await page.getByRole("link", { name: "Cotizá tu proyecto" }).first().click();
  await expect(
    page.getByRole("region", { name: "Cotizá tu proyecto" }),
  ).toBeInViewport();
  await expect(page).toHaveURL(/\/$/);
});

test("los íconos declarados en el head existen", async ({ page, request }) => {
  const hrefs = await page
    .locator('link[rel="icon"], link[rel="apple-touch-icon"]')
    .evaluateAll((links) =>
      links.map((link) => (link as HTMLLinkElement).href),
    );

  expect(hrefs).toHaveLength(3);
  for (const href of hrefs) {
    expect((await request.get(href)).ok(), href).toBe(true);
  }
});

const PROCESS_TITLE = "De tu idea al resultado, en 4 pasos.";
const PROJECTS_TITLE = "Sistemas reales, funcionando hoy.";

// Exact items from ESPECIFICACIONES.md (RF-03, RF-04 and the projects chosen for RF-05).
const SECTIONS = [
  {
    link: "Servicios",
    title: "Hecho a la medida de tu empresa.",
    items: [
      "Páginas web",
      "Sistemas y apps a medida",
      "Landing pages y promociones",
    ],
  },
  {
    link: "Proceso",
    title: PROCESS_TITLE,
    items: [
      "Conversamos",
      "Diseñamos",
      "Construimos",
      "Entregamos y acompañamos",
    ],
  },
  {
    link: "Proyectos",
    title: PROJECTS_TITLE,
    items: [
      "Cosmos Trak · Sitio web",
      "Cosmos Trak · Sistema administrativo",
      "YERON · Promoción con sorteos",
    ],
  },
];

test("cada proyecto muestra etiquetas, medio y Problema / Solución / Resultado", async ({
  page,
}) => {
  const projects = page
    .getByRole("region", { name: PROJECTS_TITLE })
    .getByRole("article");
  await expect(projects).toHaveCount(3);

  for (const project of await projects.all()) {
    await expect(
      project.getByRole("list", { name: "Etiquetas" }).getByRole("listitem"),
    ).not.toHaveCount(0);
    await expect(project.locator(".project-media > *")).toHaveCount(1);
    await expect(project.getByRole("term")).toHaveText([
      "Problema",
      "Solución",
      "Resultado",
    ]);
  }
});

test("Proyectos cierra con 'Siguiente proyecto en desarrollo'", async ({
  page,
}) => {
  await expect(
    page.getByRole("region", { name: PROJECTS_TITLE }).locator(".next-project"),
  ).toContainText("Siguiente proyecto en desarrollo");
});

for (const { link, title, items } of SECTIONS) {
  test(`la sección ${link} tiene lo que pide la spec y se llega desde la barra`, async ({
    page,
  }) => {
    const section = page.getByRole("region", { name: title });
    await expect(section.getByRole("heading", { level: 3 })).toHaveText(items);

    const navLink = (await mainNav(page)).getByRole("link", { name: link });
    await expect(navLink).toHaveAttribute(
      "href",
      `/#${await section.getAttribute("id")}`,
    );
  });
}

test("Quién está detrás resume a Marthin y lleva a su historia", async ({
  page,
}) => {
  const section = page.getByRole("region", { name: "Quién está detrás" });
  await expect(
    section.getByRole("heading", { level: 3, name: "Ing. Marthin Meza" }),
  ).toBeVisible();
  await expect(
    section.getByRole("img", { name: /Marthin Meza/ }),
  ).toBeVisible();
  await expect(section.locator("pre")).toContainText('stack: ["React"');

  await expect(
    section.getByRole("link", { name: "Conocé mi historia" }),
  ).toHaveAttribute("href", "/quien-soy/");
});

test("/quien-soy/ cuenta la historia completa y la barra lleva a Quién está detrás", async ({
  page,
}) => {
  await page.goto("/quien-soy/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Ing. Marthin Meza" }),
  ).toBeVisible();
  await expect(page.getByRole("main")).toContainText("Porque amo lo que hago");
  await expect(
    (await mainNav(page)).getByRole("link", { name: "Quién soy" }),
  ).toHaveAttribute("href", "/#quien");
  await expect(
    page
      .getByRole("region", { name: "Cotizá tu proyecto" })
      .getByRole("link", { name: "Necesito una página web" }),
  ).toBeVisible();
});

test("se cotiza por WhatsApp o por correo, sin el número escrito en la página", async ({
  page,
}) => {
  const toQuote = page.getByRole("link", {
    name: /^(Cotizá tu proyecto|Contame y lo vemos juntos\.|Hablemos)$/,
  });
  await expect(toQuote).toHaveCount(4);
  for (const button of await toQuote.all()) {
    await expect(button).toHaveAttribute("href", "#cotizacion");
  }

  const contact = page.getByRole("region", { name: "Cotizá tu proyecto" });
  const messages = new Set<string | null>();
  for (const name of [
    "Necesito una página web",
    "Necesito un sistema",
    "Necesito una landing",
  ]) {
    const whatsapp = contact.getByRole("link", { name });
    await expect(whatsapp).toHaveAttribute(
      "href",
      /^https:\/\/wa\.me\/595983755161\?text=.+/,
    );
    const href = await whatsapp.getAttribute("href");
    messages.add(new URL(href ?? "").searchParams.get("text"));
  }
  // Each need opens the chat with its own message.
  expect(messages.size).toBe(3);
  await expect(
    contact.getByRole("link", { name: "Escribime un correo" }),
  ).toHaveAttribute(
    "href",
    /^mailto:contacto@binalis\.com\.py\?subject=.+&body=.+/,
  );
  await expect(
    contact.getByRole("link", { name: "contacto@binalis.com.py" }),
  ).toBeVisible();

  // The number only lives inside the wa.me link, never as visible text.
  await expect(page.locator("body")).not.toContainText(/983\s?755\s?161/);
});

test("el pie muestra WhatsApp, el correo, el año y la versión", async ({
  page,
}) => {
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "WhatsApp" })).toBeVisible();
  await expect(
    footer.getByRole("link", { name: "contacto@binalis.com.py" }),
  ).toHaveAttribute("href", "mailto:contacto@binalis.com.py");
  await expect(footer).toContainText(`© ${new Date().getFullYear()} Binalis`);
  await expect(footer).toContainText(`v${packageJson.version}`);
  await expect(footer.locator("figcaption")).toHaveText("Mateo 11:28");
});

test("el brillo de la b pulsa, salvo con movimiento reducido", async ({
  page,
}) => {
  const glowLayer = page.locator(".symbol + .symbol");
  const animationCount = () =>
    glowLayer.evaluate((element) => element.getAnimations().length);

  expect(await animationCount()).toBe(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await animationCount()).toBe(0);
});

test("las animaciones que no terminan solo mueven opacity o transform", async ({
  page,
}) => {
  // Scrolled, so the header's CTA is pulsing too.
  await scrollToEnd(page);
  const endlessProperties = () =>
    page.evaluate(() => {
      const timingKeys = ["offset", "computedOffset", "easing", "composite"];
      return document
        .getAnimations()
        .filter(
          (animation) => animation.effect?.getTiming().iterations === Infinity,
        )
        .flatMap((animation) =>
          (animation.effect as KeyframeEffect)
            .getKeyframes()
            .flatMap((keyframe) => Object.keys(keyframe)),
        )
        .filter((key) => !timingKeys.includes(key));
    });

  await expect.poll(endlessProperties).toContain("opacity");
  const repainting = (await endlessProperties()).filter(
    (property) => !["opacity", "transform"].includes(property),
  );
  expect(repainting).toEqual([]);
});

test("una URL que no existe muestra la 404 de Binalis con status 404", async ({
  page,
}) => {
  const response = await page.goto("/esta-pagina-no-existe");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "Esta página no existe." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Volver al inicio" }),
  ).toHaveAttribute("href", "/");
  await expect(page.getByRole("img", { name: "Error 404" })).toBeVisible();
});

test("los bloques aparecen al bajar, salvo con movimiento reducido", async ({
  page,
}) => {
  const animatedBlocks = () =>
    page
      .locator(".reveal")
      .evaluateAll(
        (blocks) =>
          blocks.filter((block) => block.getAnimations().length).length,
      );

  expect(await animatedBlocks()).toBeGreaterThan(0);

  // Not even the last blocks may stay faded once the page can't scroll further.
  await scrollToEnd(page);
  const fadedBlocks = await page
    .locator(".reveal")
    .evaluateAll(
      (blocks) =>
        blocks.filter((block) => getComputedStyle(block).opacity !== "1")
          .length,
    );
  expect(fadedBlocks).toBe(0);

  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await animatedBlocks()).toBe(0);
});

test("el menú lleva a la sección y se cierra solo", async ({ page }) => {
  const isPhone = await page.getByRole("button", { name: "Menú" }).isVisible();
  const nav = await mainNav(page);
  await nav.getByRole("link", { name: "Quién soy" }).click();
  await expect(
    page.getByRole("heading", { name: "Quién está detrás" }),
  ).toBeInViewport();
  // On phones the menu closes itself; on wide screens the links never hide.
  await expect(nav.getByRole("link", { name: "Servicios" })).toBeVisible({
    visible: !isPhone,
  });
});

test("las secciones se separan con bandas alternas", async ({ page }) => {
  const background = (id: string) =>
    page
      .locator(`#${id}`)
      .evaluate((section) => getComputedStyle(section).backgroundColor);

  expect(await background("proceso")).not.toBe(await background("servicios"));
  expect(await background("proyectos")).toBe(await background("servicios"));
});

test("en el celular, el menú cubre la pantalla y lleva al contacto", async ({
  page,
}) => {
  const menuButton = page.getByRole("button", { name: "Menú" });
  test.skip(!(await menuButton.isVisible()), "El menú solo existe en celular");

  await menuButton.click();
  const nav = page.getByRole("navigation", { name: "Principal" });
  await expect(nav.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
    "href",
    /^https:\/\/wa\.me\//,
  );
  await expect(nav.getByRole("link", { name: "Correo" })).toHaveAttribute(
    "href",
    /^mailto:/,
  );

  // Starts right under the header and reaches the bottom of the screen.
  const box = await nav.boundingBox();
  const header = await page.getByRole("banner").boundingBox();
  const viewport = page.viewportSize();
  expect(box?.y).toBeCloseTo((header?.y ?? 0) + (header?.height ?? 0), 0);
  expect((box?.y ?? 0) + (box?.height ?? 0)).toBe(viewport?.height);
  expect(box?.width).toBe(viewport?.width);

  // Finished rising in, so axe doesn't measure the contrast of a half-faded row.
  await page.waitForTimeout(600);
  const { violations } = await new AxeBuilder({ page })
    .withTags(WCAG_22_AA)
    .analyze();
  expect(violations).toEqual([]);

  await page.keyboard.press("Escape");
  await expect(nav.getByRole("link", { name: "Servicios" })).toBeHidden();
});

test("la barra superior sigue a mano al bajar", async ({ page }) => {
  await page
    .getByRole("region", { name: PROCESS_TITLE })
    .scrollIntoViewIfNeeded();
  await expect(page.getByRole("banner")).toBeInViewport();
});

test("los proyectos públicos llevan a su sitio en vivo", async ({ page }) => {
  const liveLinks = page
    .getByRole("region", { name: PROJECTS_TITLE })
    .getByRole("link", { name: /^Ver sitio en vivo/ });

  await expect(liveLinks).toHaveCount(2);
  for (const link of await liveLinks.all()) {
    await expect(link).toHaveAttribute("href", /^https:\/\//);
    await expect(link).toHaveAttribute("rel", "noopener");
  }
});

test("los testimonios muestran opiniones reales con nombre y calificación", async ({
  page,
}) => {
  const testimonials = page
    .getByRole("region", { name: "Lo que dicen mis clientes" })
    .getByRole("figure");
  const count = await testimonials.count();
  // RF-07: at least one real testimonial, never more than 3.
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThanOrEqual(3);

  for (const testimonial of await testimonials.all()) {
    await expect(testimonial.locator("blockquote")).not.toBeEmpty();
    await expect(testimonial.locator(".name")).not.toBeEmpty();
    await expect(testimonial).toContainText(/Calificación: \d de 5/);
  }
});

test("el botón de cotizar de la barra brilla al bajar, salvo con movimiento reducido", async ({
  page,
}) => {
  const cta = page.getByRole("banner").getByRole("link", {
    name: "Cotizá tu proyecto",
  });
  // The glow is a pseudo-element, which only `subtree` reaches.
  const animationCount = () =>
    cta.evaluate((element) => element.getAnimations({ subtree: true }).length);

  expect(await animationCount()).toBe(0);
  await scrollToEnd(page);
  await expect.poll(animationCount).toBe(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(animationCount).toBe(0);
});

const paintedPixels = (page: Page, underId?: string) =>
  page.locator(".binary-field").evaluate((element, id) => {
    const canvas = element as HTMLCanvasElement;
    const origin = canvas.getBoundingClientRect();
    const scale = canvas.width / origin.width;
    const box =
      (id && document.getElementById(id)?.getBoundingClientRect()) || origin;
    // A bit next to an element can spill a few pixels over its edge.
    const inset = id ? 22 : 0;
    const pixels = canvas
      .getContext("2d")
      ?.getImageData(
        (box.left - origin.left + inset) * scale,
        (box.top - origin.top + inset) * scale,
        (box.width - 2 * inset) * scale,
        (box.height - 2 * inset) * scale,
      ).data;
    return pixels?.filter((_, index) => index % 4 === 3 && pixels[index])
      .length;
  }, underId);

test("el campo binario se anima sin estorbar y se pausa fuera de pantalla", async ({
  page,
}) => {
  const field = page.locator(".binary-field");
  await expect(field).toHaveAttribute("aria-hidden", "true");
  await expect(field).toHaveCSS("pointer-events", "none");
  await expect(field).toHaveAttribute("data-running", "true");
  await expect.poll(() => paintedPixels(page)).toBeGreaterThan(0);

  await scrollToEnd(page);
  await expect(field).toHaveAttribute("data-running", "false");
});

test("el campo binario no dibuja debajo del texto de la portada", async ({
  page,
}) => {
  await expect.poll(() => paintedPixels(page)).toBeGreaterThan(0);
  expect(await paintedPixels(page, "hero-title")).toBe(0);
});

test("con movimiento reducido el campo binario es un cuadro quieto", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const field = page.locator(".binary-field");
  await expect(field).toHaveAttribute("data-ready", "true");
  await expect.poll(() => paintedPixels(page)).toBeGreaterThan(0);

  const snapshot = () =>
    field.evaluate((element) => (element as HTMLCanvasElement).toDataURL());
  const before = await snapshot();
  await page.waitForTimeout(300);
  expect(await snapshot()).toBe(before);
  await expect(field).not.toHaveAttribute("data-running");
});

test("el campo binario respeta el límite de peso", async ({ page }) => {
  const scriptBytes = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .filter(({ name }) => name.includes("BinaryField"))
      .map((entry) => (entry as PerformanceResourceTiming).decodedBodySize),
  );
  expect(scriptBytes).toHaveLength(1);
  // Uncompressed: stricter than the spec's 10 KB compressed.
  expect(scriptBytes[0]).toBeLessThan(10 * 1024);
});

test.describe("sin JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("la portada muestra la grilla", async ({ page }) => {
    const gridOpacity = await page
      .locator(".hero")
      .evaluate((hero) => getComputedStyle(hero, "::after").opacity);
    expect(gridOpacity).toBe("1");
    await expect(page.locator(".binary-field")).toHaveCSS("opacity", "0");
  });
});

test("los botones para cotizar brillan más al pasar el mouse", async ({
  page,
}) => {
  const canHover = await page.evaluate(
    () => matchMedia("(hover: hover)").matches,
  );
  test.skip(!canHover, "Sin mouse no hay hover");

  const expectHoverGlow = async (name: string) => {
    const button = page.getByRole("main").getByRole("link", { name }).first();
    await button.hover();
    await expect(button).toHaveCSS("box-shadow", /40px/);
  };

  await expectHoverGlow("Cotizá tu proyecto");
  // Barely in view, where the switch-on animation is still running and must not dim the hover. Scrolled first and
  // instantly: hovering would jump here while the blocks are still rising in, and the mouse would land beside the button.
  await page.locator("#cotizacion .actions").evaluate(async (actions) => {
    actions.scrollIntoView({ block: "end", behavior: "instant" });
    await new Promise(requestAnimationFrame);
  });
  for (const name of [
    "Necesito una página web",
    "Necesito un sistema",
    "Necesito una landing",
  ]) {
    await expectHoverGlow(name);
  }
});

test("los botones para cotizar brillan", async ({ page }) => {
  const glow = (name: string) =>
    page
      .getByRole("main")
      .getByRole("link", { name })
      .first()
      .evaluate((element) => getComputedStyle(element).boxShadow);

  // The hero's, not the header's: the header one only pulses while scrolling.
  expect(await glow("Cotizá tu proyecto")).not.toBe("none");
  // The quote buttons switch on as their section comes into view.
  await scrollToEnd(page);
  expect(await glow("Necesito una página web")).not.toBe("none");
  expect(await glow("Escribime un correo")).not.toBe("none");
});
