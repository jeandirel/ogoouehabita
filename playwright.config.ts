import { defineConfig, devices } from "@playwright/test";

// Structural/visual sanity scaffolding — NOT a pixel-diff against the Stitch
// export's screen.png files. Those PNGs are non-uniform scaled thumbnails
// (different aspect ratios/scale factors per screen), not literal 1440px
// captures, so they cannot serve as reliable pixel-diff baselines. Instead:
//  - toHaveScreenshot() baselines are self-referential (first run creates
//    them under tests/visual/screens.spec.ts-snapshots/, later runs diff
//    against that local baseline to catch accidental regressions).
//  - Content/structural assertions (headline text, no console errors, no
//    horizontal overflow) are the real fidelity check against the source.
export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["html", { outputFolder: "playwright-report", open: "never" }]],
  timeout: 30_000,
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: "disabled" },
  },
  use: {
    baseURL: "http://localhost:4390",
    trace: "retain-on-failure",
  },
  webServer: {
    // Dedicated, uncommon port: this machine may have unrelated dev servers
    // (e.g. other projects) already bound to 3000, and Playwright's
    // reuseExistingServer would silently attach to whichever one answers,
    // testing the wrong app. reuseExistingServer is left off (defaults to
    // false) so this config always boots its own isolated server instance.
    command: "npm run build && npx next start -p 4390",
    url: "http://localhost:4390",
    timeout: 120_000,
  },
  projects: [
    {
      name: "mobile-390",
      use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "tablet-768",
      use: { viewport: { width: 768, height: 1024 } },
    },
    {
      name: "desktop-1440",
      use: { viewport: { width: 1440, height: 900 } },
    },
  ],
});
