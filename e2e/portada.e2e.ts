import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const WCAG_22_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.beforeEach(async ({ page }) => {
  await page.goto("/");
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

test("no genera scroll horizontal", async ({ page }) => {
  // Not window.innerWidth: mobile browsers zoom out to fit overflowing content, so it grows with it.
  const overflows = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );

  expect(overflows).toBe(false);
});
