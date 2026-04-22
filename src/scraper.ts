import { chromium, Page } from "playwright";
import fs from "fs";
import { csvWriter, logError, Product, delay } from "./utils";

interface SKUItem {
  Type: "Amazon" | "Walmart";
  SKU: string;
}

const getAmazonData = async (page: Page, sku: string): Promise<Product> => {
  const url = `https://www.amazon.in/dp/${sku}`;
  await page.goto(url, { waitUntil: "domcontentloaded" });

  await page.waitForTimeout(3000);

  const title = await page.locator("#productTitle").innerText().catch(() => "");
  const price = await page.locator(".a-price .a-offscreen").first().innerText().catch(() => "");
  const description = await page.locator("#feature-bullets").innerText().catch(() => "");
  const reviews = await page.locator("#acrCustomerReviewText").innerText().catch(() => "");

  return {
    sku,
    source: "Amazon",
    title: title.trim(),
    description: description.trim(),
    price: price.trim(),
    reviews: reviews.trim()
  };
};

const getWalmartData = async (page: Page, sku: string): Promise<Product> => {
  const url = `https://www.walmart.com/ip/${sku}`;
  await page.goto(url, { waitUntil: "domcontentloaded" });

  await page.waitForTimeout(3000);

  const title = await page.locator("h1").innerText().catch(() => "");
  const price = await page.locator("[itemprop=price]").first().innerText().catch(() => "");
  const description = await page.locator("[data-testid=product-description]").innerText().catch(() => "");
  const reviews = await page.locator("[data-testid=reviews-section]").innerText().catch(() => "");

  return {
    sku,
    source: "Walmart",
    title: title.trim(),
    description: description.trim(),
    price: price.trim(),
    reviews: reviews.trim()
  };
};

const scrape = async () => {
  const data = JSON.parse(fs.readFileSync("skus.json", "utf-8"));
  const skus: SKUItem[] = data.skus;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36"
  });

  const results: Product[] = [];

  for (const item of skus) {
    const page = await context.newPage();

    try {
      let result: Product;

      if (item.Type === "Amazon") {
        result = await getAmazonData(page, item.SKU);
      } else {
        result = await getWalmartData(page, item.SKU);
      }

      results.push(result);
    } catch (err: any) {
      logError(`${item.Type} | ${item.SKU} | ${err.message}`);
    }

    await page.close();
    await delay(2000);
  }

  await browser.close();

  if (results.length) {
    await csvWriter.writeRecords(results);
  }
};

scrape();