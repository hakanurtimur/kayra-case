import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ProductApiError,
  getProducts,
} from "../apps/cart/lib/fake-store";
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

test("cart getProducts requests the Fake Store catalog without Next cache options", async () => {
  let requestedUrl = "";
  let requestedInit: RequestInit | undefined;

  const products = await getProducts(async (url, init) => {
    requestedUrl = String(url);
    requestedInit = init;
    return jsonResponse([product]);
  });

  assert.equal(requestedUrl, "https://fakestoreapi.com/products");
  assert.equal(requestedInit, undefined);
  assert.deepEqual(products, [product]);
});

test("cart getProducts throws ProductApiError for failed responses", async () => {
  await assert.rejects(
    () => getProducts(async () => jsonResponse({ message: "nope" }, 500)),
    ProductApiError,
  );
});

test("cart getProducts throws ProductApiError for malformed catalogs", async () => {
  await assert.rejects(
    () => getProducts(async () => jsonResponse({ products: [product] })),
    ProductApiError,
  );
});
