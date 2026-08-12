import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { test } from "node:test";

const rootPackage = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

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
      destination: "http://localhost:3002/cart/:path*",
    },
  ]);
});

test("both zones emit standalone output traced from the monorepo root", async () => {
  const homeConfig = (await import("../apps/home/next.config.mjs")).default;
  const cartConfig = (await import("../apps/cart/next.config.mjs")).default;

  assert.equal(homeConfig.output, "standalone");
  assert.equal(cartConfig.output, "standalone");
  assert.equal(homeConfig.outputFileTracingRoot, resolve(root));
  assert.equal(cartConfig.outputFileTracingRoot, resolve(root));
});

test("home compiles the cart rewrite from CART_ORIGIN when provided", async () => {
  const previousCartOrigin = process.env.CART_ORIGIN;
  process.env.CART_ORIGIN = "http://cart:3002";

  try {
    const homeConfig = (
      await import(`../apps/home/next.config.mjs?cart-origin=${Date.now()}`)
    ).default;
    const rewrites = await homeConfig.rewrites();

    assert.deepEqual(rewrites, [
      {
        source: "/cart/:path*",
        destination: "http://cart:3002/cart/:path*",
      },
    ]);
  } finally {
    if (previousCartOrigin === undefined) {
      delete process.env.CART_ORIGIN;
    } else {
      process.env.CART_ORIGIN = previousCartOrigin;
    }
  }
});

test("home cart navigation uses a normal anchor across zones", () => {
  const cartLinkPath = join(root, "apps/home/components/cart-link.tsx");

  assert.equal(existsSync(cartLinkPath), true);

  const cartLinkSource = readFileSync(cartLinkPath, "utf8");

  assert.match(cartLinkSource, /<a[\s\S]*href="\/cart"/);
  assert.doesNotMatch(cartLinkSource, /from "next\/link"/);
});

test("the workspace exposes one command for both development services", () => {
  assert.equal(
    rootPackage.scripts.dev,
    'pnpm --parallel --filter "./apps/*" dev',
  );
});
