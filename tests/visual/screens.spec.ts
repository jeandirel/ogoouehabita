import { test, expect } from "@playwright/test";

/**
 * Visual/structural regression scaffolding for the 7 Stitch-sourced screens.
 *
 * IMPORTANT CAVEAT: the Stitch export's `screen.png` reference files are
 * non-uniform scaled thumbnails (different sizes/aspect ratios per screen),
 * not literal 1440px viewport captures. They are useful for a human to
 * eyeball side-by-side, but are NOT valid pixel-diff targets. These tests
 * therefore do two things instead:
 *   1. Structural fidelity checks — assert the literal copy/headline that
 *      the Stitch source specifies is actually present on the page.
 *   2. Self-referential screenshot baselines via toHaveScreenshot() — the
 *      first run records a local baseline; later runs diff against that
 *      baseline (not against Stitch's screen.png) to catch regressions
 *      introduced by future changes to this codebase.
 * Every route is also checked for console/page errors and horizontal
 * overflow (a common responsive-layout regression) across all 3 viewports
 * declared in playwright.config.ts (390x844, 768x1024, 1440x900).
 */

interface ScreenCase {
  screen: string;
  path: string;
  expectedText: string[];
}

const SCREENS: ScreenCase[] = [
  {
    screen: "accueil",
    path: "/",
    expectedText: ["Ogooué Shield Certifié", "Vérifiez-le"],
  },
  {
    screen: "acheter-un-bien",
    path: "/acheter",
    expectedText: ["Achetez avec confiance.", "Registre Foncier National"],
  },
  {
    screen: "louer-un-logement",
    path: "/louer",
    expectedText: ["Trouvez votre place.", "Registre National des Locations Certifiées"],
  },
  {
    screen: "terrains-foncier",
    path: "/terrains",
    expectedText: ["Le foncier, avec plus de transparence.", "Répertoire Officiel Gabon"],
  },
  {
    screen: "recherche-immobiliere",
    path: "/recherche",
    expectedText: ["Registre Foncier National Synchronisé", "Tous les filtres"],
  },
  {
    screen: "villa-contemporaine-angondje",
    path: "/bien/villa-contemporaine-angondje",
    expectedText: ["Villa contemporaine", "Angondjé"],
  },
  {
    screen: "passeport-ogooue-numerique",
    path: "/bien/villa-contemporaine-angondje/passeport",
    expectedText: ["Passeport Numérique Ogooué", "Timeline de Vérification"],
  },
];

for (const { screen, path, expectedText } of SCREENS) {
  test.describe(screen, () => {
    test(`${path} renders faithfully with no errors`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });
      page.on("pageerror", (err) => consoleErrors.push(err.message));

      const response = await page.goto(path);
      expect(response?.ok(), `${path} should respond with a 2xx status`).toBeTruthy();

      for (const text of expectedText) {
        await expect(
          page.getByText(text, { exact: false }).first(),
          `expected literal Stitch copy "${text}" to be present on ${path}`,
        ).toBeVisible();
      }

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(hasHorizontalOverflow, `${path} should not overflow horizontally`).toBe(false);

      expect(consoleErrors, `console/page errors on ${path}`).toEqual([]);

      await expect(page).toHaveScreenshot(`${screen}.png`, { fullPage: true });
    });
  });
}
