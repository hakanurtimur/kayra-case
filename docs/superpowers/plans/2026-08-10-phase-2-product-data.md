# Phase 2 Product Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add product listing and detail pages to the home app using Fake Store API data.

**Architecture:** Product pages stay as Server Components. A small home-local Fake Store API layer owns URL construction, `fetch` options, product ID parsing, and failure semantics while `packages/types` owns the shared `Product` type.

**Tech Stack:** Next.js App Router, TypeScript, Server Components, `fetch` with `next.revalidate`, Next Image, Tailwind CSS, Node's built-in test runner with experimental TypeScript stripping for API tests.

## Global Constraints

- Do Phase 2 only.
- Do not implement cart behavior.
- Render Add to Cart as a visual placeholder only.
- Prefer Server Components with server-side data fetching when listing/detail do not require client-side refetching.
- Do not use TanStack Query without a concrete client-side server-state need.
- Use `GET https://fakestoreapi.com/products`.
- Use `GET https://fakestoreapi.com/products/:id`.
- Add product-not-found handling where appropriate.
- Use Next.js Image correctly.

---

### Task 1: Product Type and API Contract

**Files:**
- Modify: `packages/types/src/index.ts`
- Create: `apps/home/lib/fake-store.ts`
- Create: `tests/phase2-api.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `Product`, `ProductRating`, `getProducts(fetcher?)`, `getProduct(id, fetcher?)`, `parseProductId(value)`, and `ProductApiError`.

- [ ] **Step 1: Write failing tests**

Add API tests that assert Fake Store URLs, ISR revalidation options, invalid ID handling, 404 handling, and failed-response errors.

- [ ] **Step 2: Verify tests fail**

Run: `pnpm test:api`

Expected: FAIL because `apps/home/lib/fake-store.ts` does not exist yet.

- [ ] **Step 3: Implement the minimal API layer**

Define the shared product type and API helpers with explicit error semantics.

- [ ] **Step 4: Verify tests pass**

Run: `pnpm test:api`

Expected: PASS.

### Task 2: Product Listing UI

**Files:**
- Modify: `apps/home/app/page.tsx`
- Create: `apps/home/app/loading.tsx`
- Create: `apps/home/app/error.tsx`
- Create: `apps/home/components/product-card.tsx`
- Create: `apps/home/components/product-card-skeleton.tsx`
- Create: `apps/home/components/add-to-cart-placeholder.tsx`

**Interfaces:**
- Consumes: `getProducts()`, `Product`.
- Produces: Responsive product grid with product cards, loading skeleton, and clear error state.

- [ ] **Step 1: Implement listing page as a Server Component**

Fetch products on the server and render product cards.

- [ ] **Step 2: Add loading and error states**

Use App Router `loading.tsx` and client `error.tsx`.

### Task 3: Product Detail UI

**Files:**
- Create: `apps/home/app/products/[id]/page.tsx`
- Create: `apps/home/app/products/[id]/loading.tsx`

**Interfaces:**
- Consumes: `parseProductId()`, `getProduct()`, `Product`.
- Produces: Detail page with image, title, category, description, price, visual Add to Cart placeholder, and invalid/not-found handling.

- [ ] **Step 1: Implement detail page as a Server Component**

Invalid IDs and missing products call `notFound()`.

- [ ] **Step 2: Add loading skeleton**

Use App Router route loading UI.

### Task 4: Documentation and Verification

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: Phase 2 implementation.
- Produces: Verification evidence for product list, product detail, invalid product ID, lint, typecheck, tests, independent home build, and full build.

- [ ] **Step 1: Document server-side data strategy**

Explain why Phase 2 uses Server Components instead of TanStack Query.

- [ ] **Step 2: Run verification commands**

Run: `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm --filter @kayra/home build`, `pnpm build`, plus dev-server route probes for `/`, `/products/1`, and `/products/not-a-number`.
