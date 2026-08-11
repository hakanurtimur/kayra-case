# Phase 3 Synchronized Cart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a persistent, synchronized cart across the independently built home and cart zones without coupling them to one frontend runtime.

**Architecture:** A framework-agnostic cart contract owns normalized `localStorage` persistence and browser-event synchronization. Home keeps catalog rendering server-first and adds narrow client controls; cart mounts one interactive client boundary, reads cart IDs, and uses TanStack Query to enrich them from the small Fake Store catalog.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, pnpm workspaces, Tailwind CSS, TanStack Query, Sonner, Node test runner.

## Global Constraints

- Implement Phase 3 only; do not start Docker or Phase 4.
- Store only `{ productId: number, quantity: number }`, never product snapshots.
- Use a normal `<a href="/cart">` for cross-zone navigation.
- Keep Server Components as the default and browser synchronization outside React UI code.
- The composed home origin is the synchronization target; direct ports remain isolated origins.
- Do not introduce Redux or Zustand.

---

### Task 1: Framework-Agnostic Cart Contract

**Files:**
- Create: `tests/phase3-cart-contract.test.ts`
- Modify: `packages/cart-contract/src/index.ts`
- Modify: `tsconfig.test.json`
- Modify: `package.json`

**Interfaces:**
- Consumes: `CartItem` and `ProductId` from `@kayra/types`.
- Produces: `readCart(): CartItem[]`, `writeCart(items: CartItem[]): void`, `addToCart(productId: number, quantity?: number): CartItem[]`, `updateCartItem(productId: number, quantity: number): CartItem[]`, `removeFromCart(productId: number): CartItem[]`, `clearCart(): void`, `subscribeToCartChanges(listener: () => void): () => void`, and `getCartItemCount(items: CartItem[]): number`.

- [ ] **Step 1: Write failing persistence and normalization tests**

Create a fake browser with an in-memory Storage implementation. Assert empty storage, invalid JSON, invalid values, and duplicate merging through the public API.

```ts
test("readCart normalizes duplicate entries and ignores invalid values", () => {
  installBrowser({
    "kayra:cart:v1": JSON.stringify([
      { productId: 1, quantity: 2 },
      { productId: 1, quantity: 3 },
      { productId: -2, quantity: 1 },
      { productId: 2, quantity: 0 },
    ]),
  });

  assert.deepEqual(readCart(), [{ productId: 1, quantity: 5 }]);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm test:cart-contract`

Expected: FAIL because the cart API is not exported.

- [ ] **Step 3: Implement guarded storage and normalization**

Use constants for the versioned key and custom event. Keep helpers private, return fresh normalized arrays, catch storage/JSON failures, and never access `window` without `typeof window !== "undefined"`.

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run: `pnpm test:cart-contract`

Expected: persistence and normalization tests pass.

- [ ] **Step 5: Add failing mutation, count, and subscription tests**

Cover adding new/existing items, increment/decrement through updates, zero removal, explicit removal, clear, total count, same-document `CustomEvent`, and filtered `storage` events.

- [ ] **Step 6: Run the focused test and verify RED**

Run: `pnpm test:cart-contract`

Expected: FAIL on missing mutation/notification behavior.

- [ ] **Step 7: Implement mutations and subscriptions**

All mutations read the latest cart, write normalized state, and return the resulting array. `writeCart` dispatches the custom event; subscription listens to both event channels and returns an idempotent cleanup function.

- [ ] **Step 8: Run cart and existing tests**

Run: `pnpm test`

Expected: Phase 1, Phase 2, and cart-contract suites pass.

### Task 2: Home Cart Actions And Cross-Zone Navigation

**Files:**
- Create: `apps/home/hooks/use-cart.ts`
- Create: `apps/home/components/add-to-cart-button.tsx`
- Create: `apps/home/components/cart-link.tsx`
- Create: `apps/home/components/toast-provider.tsx`
- Modify: `apps/home/components/product-card.tsx`
- Modify: `apps/home/app/(catalog)/page.tsx`
- Modify: `apps/home/app/products/[id]/page.tsx`
- Modify: `apps/home/app/layout.tsx`
- Delete: `apps/home/components/add-to-cart-placeholder.tsx`
- Modify: `apps/home/package.json`
- Modify: `tests/phase1-routing.test.mjs`

**Interfaces:**
- Consumes: cart-contract mutation, count, read, and subscription APIs.
- Produces: `useCartItems()`, `AddToCartButton`, `CartLink`, and `ToastProvider`.

- [ ] **Step 1: Write a failing structural routing test**

Read `apps/home/components/cart-link.tsx` and assert it contains an anchor with `href="/cart"` and does not import `next/link`.

- [ ] **Step 2: Run route tests and verify RED**

Run: `pnpm test:routes`

Expected: FAIL because `cart-link.tsx` does not exist.

- [ ] **Step 3: Install the lightweight toast dependency**

Run: `pnpm --filter @kayra/home add sonner`

- [ ] **Step 4: Implement narrow home client boundaries**

`useCartItems` starts with an empty server-safe snapshot, reads storage on mount, and subscribes for later updates. `AddToCartButton` calls `addToCart(productId)` and announces `Added <title> to cart`. `CartLink` renders a normal anchor and total quantity. `ToastProvider` renders Sonner's toaster.

- [ ] **Step 5: Wire server-rendered product views**

Pass product identity into `AddToCartButton`, replace the old placeholder, render `CartLink` in the catalog header, and keep all product links on `next/link`.

- [ ] **Step 6: Run route tests and home typecheck**

Run: `pnpm test:routes`

Run: `pnpm --filter @kayra/home typecheck`

Expected: both pass.

### Task 3: Cart Catalog Query Boundary

**Files:**
- Create: `apps/cart/lib/fake-store.ts`
- Create: `tests/phase3-cart-api.test.ts`
- Create: `apps/cart/components/cart-providers.tsx`
- Create: `apps/cart/hooks/use-cart.ts`
- Modify: `apps/cart/package.json`
- Modify: `apps/cart/next.config.mjs`
- Modify: `tsconfig.test.json`
- Modify: `package.json`

**Interfaces:**
- Consumes: Fake Store `GET /products`, `Product`, and cart-contract subscription APIs.
- Produces: `getProducts(fetcher?: typeof fetch): Promise<Product[]>`, a scoped QueryClient provider, and `{ items, isHydrated }` from `useCart()`.

- [ ] **Step 1: Write a failing client catalog API test**

Assert `getProducts` requests `https://fakestoreapi.com/products`, returns the product array, and throws `ProductApiError` for non-success responses.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm test:cart-api`

Expected: FAIL because the cart API module does not exist.

- [ ] **Step 3: Implement the catalog API**

Use browser-compatible `fetch` without Next.js cache options. Validate the response as an array and expose a clear typed error.

- [ ] **Step 4: Run the API test and verify GREEN**

Run: `pnpm test:cart-api`

Expected: PASS.

- [ ] **Step 5: Install query and toast dependencies**

Run: `pnpm --filter @kayra/cart add @tanstack/react-query sonner`

- [ ] **Step 6: Implement the scoped provider and cart hook**

Create one stable QueryClient per mounted provider with a five-minute stale time and one retry. Render Sonner in that same interactive boundary. The hook performs the initial storage read after mount and subscribes to cart changes.

- [ ] **Step 7: Configure remote product images**

Allow `https://fakestoreapi.com/img/**` in the cart app's Next Image configuration.

### Task 4: Complete Responsive Cart Experience

**Files:**
- Create: `apps/cart/components/cart-experience.tsx`
- Create: `apps/cart/components/cart-item-row.tsx`
- Create: `apps/cart/components/cart-skeleton.tsx`
- Modify: `apps/cart/app/page.tsx`

**Interfaces:**
- Consumes: `CartProviders`, `useCart`, `getProducts`, cart-contract mutations, `Product`, Next Image, and Sonner.
- Produces: empty, loading, error, and populated cart states with quantity controls and totals.

- [ ] **Step 1: Implement the server page shell**

Keep `app/page.tsx` as a Server Component and mount only `<CartProviders><CartExperience /></CartProviders>` as the interactive subtree.

- [ ] **Step 2: Implement explicit cart states**

Show skeletons until browser storage is read and while a non-empty cart loads its catalog. Show a retryable error for failed catalog requests and the existing continue-shopping empty state for zero lines.

- [ ] **Step 3: Implement enriched lines and totals**

Map the small fetched catalog by ID, preserve cart ordering, render product image/title/unit price, accessible increment/decrement/remove controls, line totals, subtotal, and total item quantity.

- [ ] **Step 4: Implement feedback and responsive layout**

Increment/decrement writes immediately. Removal and clear actions show required toast feedback. Use compact rows on desktop and stacked media/content/controls on mobile, with visible focus styles and stable control dimensions.

- [ ] **Step 5: Run test, lint, and typecheck gates**

Run: `pnpm test`

Run: `pnpm lint`

Run: `pnpm typecheck`

Expected: all pass without warnings.

### Task 5: Documentation And End-To-End Verification

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: implemented architecture and observed verification results.
- Produces: an accurate Phase 3 architecture and limitations record.

- [ ] **Step 1: Update README**

Document the cart model/API, normalization, CustomEvent, storage event, hard zone navigation, direct-port limitation, state-management decision, cart-only TanStack Query usage, small-catalog trade-off, and production backend direction.

- [ ] **Step 2: Run independent and workspace builds**

Run: `pnpm --filter @kayra/home build`

Run: `pnpm --filter @kayra/cart build`

Run: `pnpm build`

Expected: every build succeeds independently and together.

- [ ] **Step 3: Start both dev servers**

Run home on port 3000 and cart on port 3001. Keep both processes alive for browser verification and stop them afterward.

- [ ] **Step 4: Verify the composed browser flow**

Through `http://localhost:3000`, verify listing/detail add actions, immediate count updates, duplicate increment behavior, `/cart` hard navigation persistence, cart controls, remove, clear, refresh persistence, and another-tab storage synchronization where possible.

- [ ] **Step 5: Verify routing and console behavior**

Confirm `/cart/cart` returns 404 and inspect the browser console for hydration/runtime errors.

- [ ] **Step 6: Capture final status**

Run: `git status --short`

Report exact automated and manual results, honest limitations, all created/modified files, and exactly one recommended commit message. Stop before Phase 4.
