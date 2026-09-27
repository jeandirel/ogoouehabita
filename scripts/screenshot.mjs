import { chromium } from "playwright-core";
import { existsSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:3002/";
const outPath = process.argv[3] ?? "/tmp/screenshot.png";
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);
const fullPage = process.argv[6] !== "false";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(url, { waitUntil: "networkidle" });
await page.screenshot({ path: outPath, fullPage });
await browser.close();
console.log("saved", outPath, existsSync(outPath));
