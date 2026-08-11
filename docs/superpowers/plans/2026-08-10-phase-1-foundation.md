# Phase 1 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a two-app Next.js Multi-Zone workspace with independently buildable `home` and `cart` applications.

**Architecture:** The root workspace owns shared TypeScript, lint, and package-manager configuration. `apps/home` runs on port 3000 and proxies `/cart` routes to `apps/cart`, which runs on port 3001 with `basePath: "/cart"` and its root page at `apps/cart/app/page.tsx`.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, pnpm workspaces, Node's built-in test runner for Phase 1 routing assertions.

## Global Constraints

- Do only Phase 1.
- home should run on port 3000.
- cart should run on port 3001.
- home and cart must have independent build processes.
- Use Next.js Multi-Zone, not Module Federation.
- If the cart app uses `basePath: "/cart"`, its root page must be `apps/cart/app/page.tsx`.
- Document that localStorage cart sync only works in the composed home-origin experience where `/cart` is rewritten to the cart app.
- Document that direct access via `:3000` and `:3001` is cross-origin, so localStorage cannot be shared there.

---

### Task 1: Route Contract Test

**Files:**
- Create: `tests/phase1-routing.test.mjs`

**Interfaces:**
- Consumes: `apps/home/next.config.mjs`, `apps/cart/next.config.mjs`, `apps/cart/app/page.tsx`.
- Produces: A repeatable Phase 1 assertion command: `node --test tests/phase1-routing.test.mjs`.

- [ ] **Step 1: Write the failing test**

```js
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/phase1-routing.test.mjs`

Expected: FAIL because the app configs do not exist yet.

### Task 2: Workspace and App Scaffold

**Files:**
- Create: root package/config files.
- Create: `apps/home` Next.js app.
- Create: `apps/cart` Next.js app.
- Create: `packages/ui`, `packages/types`, and `packages/cart-contract`.
- Modify: `README.md`.

**Interfaces:**
- Consumes: Phase 1 assignment requirements.
- Produces: `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm --filter @kayra/home build`, `pnpm --filter @kayra/cart build`, and `pnpm test:routes`.

- [ ] **Step 1: Add root workspace files**

Create `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, and shared tooling config.

- [ ] **Step 2: Add app files**

Create minimal accessible pages, layouts, Tailwind styles, and Next config for both apps.

- [ ] **Step 3: Add package shells**

Create buildable TypeScript package shells for `ui`, `types`, and `cart-contract`.

- [ ] **Step 4: Document Phase 1 architecture**

README must cover Multi-Zone routing, cart `basePath`, localStorage origin limits, ports, and commands.

- [ ] **Step 5: Run the route test to verify it passes**

Run: `pnpm test:routes`

Expected: PASS.

### Task 3: Phase 1 Verification

**Files:**
- No additional files expected unless verification reveals a concrete scaffold issue.

**Interfaces:**
- Consumes: Complete scaffold from Task 2.
- Produces: Verification evidence for the user.

- [ ] **Step 1: Install dependencies**

Run: `pnpm install`.

- [ ] **Step 2: Verify route contract**

Run: `pnpm test:routes`.

- [ ] **Step 3: Run lint**

Run: `pnpm lint`.

- [ ] **Step 4: Run typecheck**

Run: `pnpm typecheck`.

- [ ] **Step 5: Run independent production builds**

Run: `pnpm --filter @kayra/home build` and `pnpm --filter @kayra/cart build`.

- [ ] **Step 6: Run aggregate production build**

Run: `pnpm build`.

- [ ] **Step 7: Run both apps and verify routes**

Run: `pnpm --filter @kayra/cart dev` and `pnpm --filter @kayra/home dev`, then verify `http://localhost:3000/`, `http://localhost:3000/cart`, and `http://localhost:3001/cart`.

- [ ] **Step 8: Stop before Phase 2**

Report changes, files, commands, results, trade-offs, and exactly one commit message.
