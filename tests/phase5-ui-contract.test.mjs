import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const categoryNavSource = await readFile(
  new URL("../apps/home/components/category-nav.tsx", import.meta.url),
  "utf8",
);
const popularShelfSource = await readFile(
  new URL("../apps/home/components/popular-shelf.tsx", import.meta.url),
  "utf8",
);
const productCardSource = await readFile(
  new URL("../apps/home/components/product-card.tsx", import.meta.url),
  "utf8",
);
const productDetailSource = await readFile(
  new URL("../apps/home/app/products/[id]/page.tsx", import.meta.url),
  "utf8",
);
const cartItemRowSource = await readFile(
  new URL("../apps/cart/components/cart-item-row.tsx", import.meta.url),
  "utf8",
);
const catalogLoadingSource = await readFile(
  new URL("../apps/home/app/(catalog)/loading.tsx", import.meta.url),
  "utf8",
);
const productLoadingSource = await readFile(
  new URL("../apps/home/app/products/[id]/loading.tsx", import.meta.url),
  "utf8",
);
const categoryShowcaseSource = await readFile(
  new URL("../apps/home/components/category-showcase.tsx", import.meta.url),
  "utf8",
);
const homeDockerfileSource = await readFile(
  new URL("../apps/home/Dockerfile", import.meta.url),
  "utf8",
);
const cartDockerfileSource = await readFile(
  new URL("../apps/cart/Dockerfile", import.meta.url),
  "utf8",
);

test("mobile category links preserve 44px touch targets", () => {
  assert.match(categoryNavSource, /className={`inline-flex min-h-11 /);
});

test("mobile product media leaves room for long detail titles", () => {
  assert.match(productDetailSource, /aspect-\[4\/3\].*sm:aspect-square/);
  assert.match(
    productDetailSource,
    /text-2xl font-black leading-tight text-ink sm:text-4xl/,
  );
  assert.doesNotMatch(productDetailSource, /fixed inset-x-4/);
});

test("popular shelf copy describes the rating-count ranking", () => {
  assert.match(popularShelfSource, />\s*Most reviewed\s*</);
  assert.doesNotMatch(popularShelfSource, />\s*Most saved\s*</);
});

test("product image links expose explicit accessible names", () => {
  for (const source of [productCardSource, popularShelfSource, cartItemRowSource]) {
    assert.match(source, /aria-label={`View \${product\.title}`}/);
  }
});

test("loading layouts preserve the responsive geometry of loaded content", () => {
  assert.match(productLoadingSource, /aspect-\[4\/3\].*sm:aspect-square/);
  assert.match(catalogLoadingSource, /auto-cols-\[66%\]/);
  assert.match(catalogLoadingSource, /auto-cols-\[72%\]/);
  assert.match(catalogLoadingSource, /h-11 w-20/);
});

test("the above-the-fold category images are prioritized", () => {
  assert.match(categoryShowcaseSource, /priority={index < 2}/);
});

test("standalone Docker images include each application's public assets", () => {
  assert.match(
    homeDockerfileSource,
    /COPY --from=builder --chown=node:node \/workspace\/apps\/home\/public \.\/apps\/home\/public/,
  );
  assert.match(
    cartDockerfileSource,
    /COPY --from=builder --chown=node:node \/workspace\/apps\/cart\/public \.\/apps\/cart\/public/,
  );
});
