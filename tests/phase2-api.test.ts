import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ProductApiError,
  getProduct,
  getProducts,
  parseProductId,
} from "../apps/home/lib/fake-store";
import type { Product } from "../packages/types/src/index";

const product: Product = {
  id: 1,
  title: "Fjallraven Backpack",
  price: 109.95,
  description: "A practical backpack for everyday use.",
  category: "men's clothing",
  image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  rating: {
    rate: 3.9,
    count: 120,
  },
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

test("getProducts requests the Fake Store collection with ISR revalidation", async () => {
  let requestedUrl = "";
  let requestedInit: unknown;

  const products = await getProducts(async (url, init) => {
    requestedUrl = String(url);
    requestedInit = init;
    return jsonResponse([product]);
  });

  assert.equal(requestedUrl, "https://fakestoreapi.com/products");
  assert.deepEqual(requestedInit, { next: { revalidate: 300 } });
  assert.deepEqual(products, [product]);
});

test("getProduct requests a product detail endpoint with ISR revalidation", async () => {
  let requestedUrl = "";
  let requestedInit: unknown;

  const foundProduct = await getProduct(1, async (url, init) => {
    requestedUrl = String(url);
    requestedInit = init;
    return jsonResponse(product);
  });

  assert.equal(requestedUrl, "https://fakestoreapi.com/products/1");
  assert.deepEqual(requestedInit, { next: { revalidate: 300 } });
  assert.deepEqual(foundProduct, product);
});

test("getProduct returns null for invalid IDs without calling fetch", async () => {
  let fetchCalled = false;

  const foundProduct = await getProduct(0, async () => {
    fetchCalled = true;
    return jsonResponse(product);
  });

  assert.equal(foundProduct, null);
  assert.equal(fetchCalled, false);
});

test("getProduct returns null when the Fake Store detail endpoint is missing", async () => {
  const foundProduct = await getProduct(9999, async () => jsonResponse({}, 404));

  assert.equal(foundProduct, null);
});

test("getProduct returns null when the Fake Store detail body is empty", async () => {
  const foundProduct = await getProduct(9999, async () => jsonResponse(null));

  assert.equal(foundProduct, null);
});

test("getProduct returns null when the Fake Store detail response has no body", async () => {
  const foundProduct = await getProduct(9999, async () => new Response("", {
    status: 200,
  }));

  assert.equal(foundProduct, null);
});

test("getProducts throws ProductApiError when the collection request fails", async () => {
  await assert.rejects(
    () => getProducts(async () => jsonResponse({ message: "nope" }, 500)),
    ProductApiError,
  );
});

test("parseProductId accepts positive integer route params only", () => {
  assert.equal(parseProductId("12"), 12);
  assert.equal(parseProductId("0"), null);
  assert.equal(parseProductId("-1"), null);
  assert.equal(parseProductId("1.5"), null);
  assert.equal(parseProductId("not-a-number"), null);
});
