import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import {
  addToCart,
  clearCart,
  getCartItemCount,
  readCart,
  removeFromCart,
  subscribeToCartChanges,
  updateCartItem,
  writeCart,
} from "../packages/cart-contract/src/index";

const CART_STORAGE_KEY = "kayra:cart:v1";
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "window",
);

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

function installBrowser(initialValues: Record<string, string> = {}) {
  const storage = new MemoryStorage();

  for (const [key, value] of Object.entries(initialValues)) {
    storage.setItem(key, value);
  }

  const browserWindow = new EventTarget() as EventTarget & {
    localStorage: Storage;
  };
  browserWindow.localStorage = storage;

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: browserWindow,
  });

  return {
    browserWindow,
    storage,
  };
}

function dispatchStorageEvent(browserWindow: EventTarget, key: string | null) {
  const event = new Event("storage");
  Object.defineProperty(event, "key", { value: key });
  browserWindow.dispatchEvent(event);
}

afterEach(() => {
  if (originalWindowDescriptor) {
    Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    return;
  }

  Reflect.deleteProperty(globalThis, "window");
});

test("readCart returns an empty cart when browser storage is unavailable", () => {
  assert.deepEqual(readCart(), []);
});

test("readCart returns an empty cart for empty storage", () => {
  installBrowser();

  assert.deepEqual(readCart(), []);
});

test("readCart safely ignores invalid JSON", () => {
  installBrowser({ [CART_STORAGE_KEY]: "{not-json" });

  assert.deepEqual(readCart(), []);
});

test("readCart merges duplicate products and ignores invalid values", () => {
  installBrowser({
    [CART_STORAGE_KEY]: JSON.stringify([
      { productId: 1, quantity: 2 },
      { productId: 1, quantity: 3 },
      { productId: -2, quantity: 1 },
      { productId: 2, quantity: 0 },
      { productId: 3.5, quantity: 1 },
      { productId: 4, quantity: 1.5 },
      null,
    ]),
  });

  assert.deepEqual(readCart(), [{ productId: 1, quantity: 5 }]);
});

test("addToCart adds a new product with the default quantity", () => {
  installBrowser();

  assert.deepEqual(addToCart(7), [{ productId: 7, quantity: 1 }]);
  assert.deepEqual(readCart(), [{ productId: 7, quantity: 1 }]);
});

test("addToCart increments an existing product instead of duplicating it", () => {
  installBrowser({
    [CART_STORAGE_KEY]: JSON.stringify([{ productId: 7, quantity: 2 }]),
  });

  assert.deepEqual(addToCart(7, 3), [{ productId: 7, quantity: 5 }]);
});

test("updateCartItem increments and decrements quantity", () => {
  installBrowser({
    [CART_STORAGE_KEY]: JSON.stringify([{ productId: 7, quantity: 2 }]),
  });

  assert.deepEqual(updateCartItem(7, 3), [{ productId: 7, quantity: 3 }]);
  assert.deepEqual(updateCartItem(7, 1), [{ productId: 7, quantity: 1 }]);
});

test("updateCartItem removes a product when quantity is zero or less", () => {
  installBrowser({
    [CART_STORAGE_KEY]: JSON.stringify([
      { productId: 7, quantity: 2 },
      { productId: 8, quantity: 1 },
    ]),
  });

  assert.deepEqual(updateCartItem(7, 0), [{ productId: 8, quantity: 1 }]);
  assert.deepEqual(updateCartItem(8, -1), []);
});

test("removeFromCart removes only the requested product", () => {
  installBrowser({
    [CART_STORAGE_KEY]: JSON.stringify([
      { productId: 7, quantity: 2 },
      { productId: 8, quantity: 1 },
    ]),
  });

  assert.deepEqual(removeFromCart(7), [{ productId: 8, quantity: 1 }]);
});

test("clearCart removes every stored item", () => {
  installBrowser({
    [CART_STORAGE_KEY]: JSON.stringify([{ productId: 7, quantity: 2 }]),
  });

  clearCart();

  assert.deepEqual(readCart(), []);
});

test("cart mutations ignore invalid product IDs and quantities", () => {
  installBrowser({
    [CART_STORAGE_KEY]: JSON.stringify([{ productId: 7, quantity: 2 }]),
  });

  assert.deepEqual(addToCart(0), [{ productId: 7, quantity: 2 }]);
  assert.deepEqual(addToCart(8, 1.5), [{ productId: 7, quantity: 2 }]);
  assert.deepEqual(updateCartItem(7, 1.5), [{ productId: 7, quantity: 2 }]);
  assert.deepEqual(removeFromCart(-1), [{ productId: 7, quantity: 2 }]);
});

test("writeCart normalizes invalid and duplicate entries before persistence", () => {
  installBrowser();

  writeCart([
    { productId: 2, quantity: 1 },
    { productId: 2, quantity: 2 },
    { productId: Number.NaN, quantity: 1 },
  ]);

  assert.deepEqual(readCart(), [{ productId: 2, quantity: 3 }]);
});

test("getCartItemCount returns the total quantity", () => {
  assert.equal(
    getCartItemCount([
      { productId: 2, quantity: 3 },
      { productId: 8, quantity: 2 },
    ]),
    5,
  );
});

test("subscribers receive same-document writes until they unsubscribe", () => {
  installBrowser();
  let notifications = 0;
  const unsubscribe = subscribeToCartChanges(() => {
    notifications += 1;
  });

  writeCart([{ productId: 2, quantity: 1 }]);
  unsubscribe();
  writeCart([{ productId: 2, quantity: 2 }]);

  assert.equal(notifications, 1);
});

test("subscribers receive matching cross-document storage events only", () => {
  const { browserWindow } = installBrowser();
  let notifications = 0;
  const unsubscribe = subscribeToCartChanges(() => {
    notifications += 1;
  });

  dispatchStorageEvent(browserWindow, "unrelated:key");
  dispatchStorageEvent(browserWindow, CART_STORAGE_KEY);
  unsubscribe();

  assert.equal(notifications, 1);
});
