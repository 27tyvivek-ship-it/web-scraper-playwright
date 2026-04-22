import fs from "fs";
import path from "path";
import { createObjectCsvWriter } from "csv-writer";

export interface Product {
  sku: string;
  source: string;
  title: string;
  description: string;
  price: string;
  reviews: string;
}

const csvPath = path.resolve("product_data.csv");

export const csvWriter = createObjectCsvWriter({
  path: csvPath,
  header: [
    { id: "sku", title: "SKU" },
    { id: "source", title: "Source" },
    { id: "title", title: "Title" },
    { id: "description", title: "Description" },
    { id: "price", title: "Price" },
    { id: "reviews", title: "Number of Reviews and rating" }
  ],
  append: fs.existsSync(csvPath)
});

export const logError = (message: string) => {
  fs.appendFileSync("errors.log", `${new Date().toISOString()} - ${message}\n`);
};

export const delay = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));