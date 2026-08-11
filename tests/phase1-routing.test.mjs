import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();

test("cart zone uses /cart basePath with a root app page", async () => {
  const cartConfig = (await import("../apps/cart/next.config.mjs")).default;

  assert.equal(cartConfig.basePath, "/cart");
  assert.equal(existsSync(join(root, "apps/cart/app/page.tsx")), true);
  assert.equal(existsSync(join(root, "apps/cart/app/cart/page.tsx")), false);
});

test("home proxies /cart routes to the cart service without doubling the path", async () => {
  const homeConfig = (await import("../apps/home/next.config.mjs")).default;
  const rewrites = await homeConfig.rewrites();

  assert.deepEqual(rewrites, [
    {
      source: "/cart/:path*",
      destination: "http://localhost:3001/cart/:path*",
    },
  ]);
});

test("home cart navigation uses a normal anchor across zones", () => {
  const cartLinkPath = join(root, "apps/home/components/cart-link.tsx");

  assert.equal(existsSync(cartLinkPath), true);

  const cartLinkSource = readFileSync(cartLinkPath, "utf8");

  assert.match(cartLinkSource, /<a[\s\S]*href="\/cart"/);
  assert.doesNotMatch(cartLinkSource, /from "next\/link"/);
});
