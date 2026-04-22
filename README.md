## `/webScrapper/README.md`

```md id="4k9p2d"
# Web Scraper (TypeScript + Playwright)

## Overview
This project scrapes product data from Amazon and Walmart using SKU inputs and stores the results in a CSV file.

## Tech Stack
- TypeScript
- Playwright
- csv-writer

## Project Structure
```

/webScrapper
|-- /src
|   |-- scraper.ts
|   |-- utils.ts
|-- skus.json
|-- package.json
|-- tsconfig.json
|-- product_data.csv
|-- errors.log
|-- README.md

````

## Installation

```bash
npm install
npx playwright install
````

## Input

Edit `skus.json` to add SKUs:

```json
{
  "skus": [
    { "Type": "Amazon", "SKU": "B0CT4BB651" },
    { "Type": "Walmart", "SKU": "5326288985" },
    { "Type": "Amazon", "SKU": "B01LR5S6HK" }
  ]
}
```

## Run

Development:

```bash
npm run dev
```

Build + Run:

```bash
npm run build
npm start
```

## How It Works

* Reads SKU list from `skus.json`
* Opens product pages using Playwright
* Extracts:

  * Title
  * Price
  * Description
  * Number of Reviews and rating
* Saves results into CSV
* Logs failures into log file

## Output Files

### product_data.csv

* Auto-created if not present
* Data is appended on every run
* Columns:

  * SKU
  * Source
  * Title
  * Description
  * Price
  * Number of Reviews and rating

### errors.log

* Auto-created if not present
* Stores failed requests with timestamp
* Format:

```
timestamp - Source | SKU | error message
```

## Error Handling

* Missing selectors handled safely
* Errors logged without stopping execution
* Each SKU processed independently

## Assumptions

* Public product pages accessible
* No authentication required
* Basic anti-bot handling using delay and user-agent

## Limitations

* CAPTCHA not bypassed
* DOM structure changes can break selectors
* High request volume may trigger blocking

## Notes

* Runs sequentially to reduce blocking risk
* Stable internet required

## Optional Improvements

* Retry mechanism
* Proxy rotation
* Concurrent scraping
* Unit testing
