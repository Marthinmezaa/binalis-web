import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const WCAG_22_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

// The preview server sends production's CSP (see astro.config.mjs).
test("no hay errores en consola bajo la CSP de producción", async ({
  page,
}) => {
  const response = await page.request.get("/");
  expect(response.headers()["content-security-policy"]).toBeTruthy();

  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.reload();
  await page.evaluate(() => document.fonts.ready);

  expect(errors).toEqual([]);
});

test("no tiene violaciones de accesibilidad WCAG 2.2 AA", async ({ page }) => {
  const { violations } = await new AxeBuilder({ page })
    .withTags(WCAG_22_AA)
    .analyze();

  expect(violations).toEqual([]);
});

test("el primer foco es 'Saltar al contenido' y lleva al contenido", async ({
  page,
}) => {
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(skipLink).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#contenido$/);
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
      `#${await section.getAttribute("id")}`,
    );
  });
}

test("no genera scroll horizontal", async ({ page }) => {
  // Not window.innerWidth: mobile browsers zoom out to fit overflowing content, so it grows with it.
  const overflows = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );

  expect(overflows).toBe(false);
});
