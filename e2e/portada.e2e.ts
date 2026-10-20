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

// Exact titles from ESPECIFICACIONES.md (RF-03, RF-04 and the projects chosen for RF-05).
const SECTIONS = [
  {
    name: "Servicios",
    items: [
      "Páginas web",
      "Sistemas y apps a medida",
      "Landing pages y promociones",
    ],
  },
  {
    name: "Proceso",
    items: [
      "Conversamos",
      "Diseñamos",
      "Construimos",
      "Entregamos y acompañamos",
    ],
  },
  {
    name: "Proyectos",
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
    .getByRole("region", { name: "Proyectos" })
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

test("Proyectos cierra con 'Siguiente proyecto cargando…'", async ({
  page,
}) => {
  await expect(
    page.getByRole("region", { name: "Proyectos" }).locator(".next-project"),
  ).toContainText("Siguiente proyecto cargando…");
});

for (const { name, items } of SECTIONS) {
  test(`la sección ${name} tiene lo que pide la spec y se llega desde la barra`, async ({
    page,
  }) => {
    const section = page.getByRole("region", { name });
    await expect(section.getByRole("heading", { level: 3 })).toHaveText(items);

    const navLink = page
      .getByRole("navigation", { name: "Principal" })
      .getByRole("link", { name });
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

  await section.getByRole("link", { name: "Conocé mi historia" }).click();
  await expect(page).toHaveURL(/\/quien-soy\/$/);
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
    page
      .getByRole("navigation", { name: "Principal" })
      .getByRole("link", { name: "Quién soy" }),
  ).toHaveAttribute("href", "/#quien");
  await expect(
    page
      .getByRole("region", { name: "Cotizá tu proyecto" })
      .getByRole("link", { name: "Hablemos por WhatsApp" }),
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
  await expect(
    contact.getByRole("link", { name: "Hablemos por WhatsApp" }),
  ).toHaveAttribute("href", /^https:\/\/wa\.me\/595983755161\?text=.+/);
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
  const symbol = page.locator(".symbol");
  const animationCount = () =>
    symbol.evaluate((element) => element.getAnimations().length);

  expect(await animationCount()).toBe(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await animationCount()).toBe(0);
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

test("la barra superior sigue a mano al bajar", async ({ page }) => {
  await page.getByRole("region", { name: "Proceso" }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("banner")).toBeInViewport();
});

test("los proyectos públicos llevan a su sitio en vivo", async ({ page }) => {
  const liveLinks = page
    .getByRole("region", { name: "Proyectos" })
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
  const animationCount = () =>
    cta.evaluate((element) => element.getAnimations().length);

  expect(await animationCount()).toBe(0);
  await scrollToEnd(page);
  await expect.poll(animationCount).toBe(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(animationCount).toBe(0);
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
  expect(await glow("Hablemos por WhatsApp")).not.toBe("none");
  expect(await glow("Escribime un correo")).not.toBe("none");
});
