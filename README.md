# Kayra Micro-Frontend Commerce Demo

Kayra is a frontend take-home project built as a small e-commerce demo with two independently buildable Next.js applications:

- `apps/home` serves the shopping experience on port `3000`.
- `apps/cart` serves the cart zone on port `3002`.

This repository is currently at **Phase 4: production containerization**. Final UI polish, CI/CD, and Phase 5 work remain out of scope.

## Architecture

The project uses a pnpm workspace:

```text
apps/
  home/
  cart/
packages/
  ui/
  types/
  cart-contract/
```

`home` and `cart` are separate Next.js App Router applications. Shared package shells live under `packages/` so later phases can share UI, types, and cart contract code without coupling the apps into one runtime.

Each application can also be built as an independent production container. Next.js standalone output traces the runtime files needed by that application from the monorepo root, and each image runs its generated server as a non-root user.

## Multi-Zone Routing

This project uses **Next.js Multi-Zone**, not Module Federation. Multi-Zone keeps each frontend independently buildable and deployable while letting one origin compose the user-facing routes.

For local Phase 1 development:

- Home runs at `http://localhost:3000`.
- Cart runs at `http://localhost:3002/cart`.
- Home rewrites `/cart/:path*` to `http://localhost:3002/cart/:path*`.

The cart app sets:

```js
basePath: "/cart"
```

Because of that `basePath`, the cart app root route is implemented at:

```text
apps/cart/app/page.tsx
```

It is intentionally **not** implemented at `apps/cart/app/cart/page.tsx`; that would risk composing the route as `/cart/cart`.

## Cart Data Model And Contract

`packages/cart-contract` is framework-agnostic. It stores only product identity and quantity under the versioned `localStorage` key `kayra:cart:v1`:

```ts
type CartItem = {
  productId: number;
  quantity: number;
};
```

Complete `Product` snapshots are deliberately not persisted. Product titles, images, descriptions, and prices belong to the product source and may change independently; persisting them in the cart would create stale duplicate data.

The package exposes:

```ts
readCart(): CartItem[]
writeCart(items: CartItem[]): void
addToCart(productId: number, quantity?: number): CartItem[]
updateCartItem(productId: number, quantity: number): CartItem[]
removeFromCart(productId: number): CartItem[]
clearCart(): void
subscribeToCartChanges(listener: () => void): () => void
getCartItemCount(items: CartItem[]): number
```

Storage reads validate and normalize unknown JSON. Invalid IDs and quantities are ignored, duplicate product IDs are merged, and quantities remain positive integers. Invalid JSON and unavailable browser storage safely produce an empty cart. All browser-only APIs are guarded so package imports remain safe during server rendering.

## Cart Synchronization

The cart contract uses two browser event channels:

- `writeCart` dispatches a versioned `CustomEvent` so subscribers in the same document update immediately.
- `subscribeToCartChanges` also listens for the browser `storage` event so other documents or tabs on the same origin can refresh their snapshot.

Home-to-cart navigation is a zone boundary and therefore uses a normal `<a href="/cart">`, not `next/link`. The hard navigation reaches the cart application through the home rewrite, then the cart client boundary performs its initial read from the same origin's `localStorage`. This preserves cart state without pretending the independently built applications share one JavaScript runtime.

This approach is intended for the composed Multi-Zone experience served through the **home origin**, where `http://localhost:3000/cart` is rewritten to the cart application. In that composed flow, home and cart share the same browser origin, so origin-scoped browser storage can synchronize state.

When the apps are accessed directly as separate origins, such as:

- `http://localhost:3000`
- `http://localhost:3002/cart`

`localStorage` is scoped per origin and cannot be shared between them. This means an item added on direct port 3000 is not visible when the cart app is opened directly on port 3002.

`localStorage` is only a task-level persistence mechanism. A production implementation would normally make cart state backend-owned so authenticated users can persist across origins, deployments, sessions, and devices. A cart API would also reconcile inventory and pricing, and would normally return enriched cart lines or support efficient batch product lookup.

The same origin rule applies to Docker. Use `http://localhost:3000/cart` for the composed flow. Opening `http://localhost:3002/cart` directly creates a different browser origin, so its cart storage is intentionally independent.

## Server and Client Components

Product listing and product detail are implemented as Server Components. They fetch product data on the server through `apps/home/lib/fake-store.ts`.

TanStack Query remains intentionally absent from the home product listing and detail routes. Those routes do not need client-side refetching, optimistic updates, polling, filtering, or user-specific server state. Keeping their data fetching on the server reduces client bundle weight and lets Next.js own caching and rendering behavior.

The product listing uses `fetch` with `next.revalidate: 300`, so the home route is prerendered with a five-minute revalidation window. Product detail pages also use the shared API layer and are server-rendered on demand for dynamic IDs. Client Components are introduced only where required by Next.js, such as the route-level error boundary.

Home adds Client Components only for Add to Cart actions, the live cart count, storage subscriptions, and toast feedback. Product cards and product detail rendering remain Server Components.

## Cart Product Data And State Management

The cart application uses TanStack Query inside its interactive client boundary. This is justified because cart identity is client-owned in `localStorage`: the product IDs are known only after hydration, and the associated product information must then be loaded in the browser. The assignment's Fake Store catalog is small, so one `GET https://fakestoreapi.com/products` request is simpler and more maintainable than one request per cart line. The QueryClient provider does not wrap the entire application layout.

Redux and Zustand are not used. The durable cart has a small framework-independent contract, and React only needs a `useState`/`useEffect` subscription bridge. A global store would duplicate that state and would not make two independently built zones share a runtime. For a production system, the backend cart API and a server-state cache would replace browser storage as the source of truth.

## Production Containers

The repository contains separate multi-stage Dockerfiles:

- `apps/home/Dockerfile` builds and runs the home application on port `3000`.
- `apps/cart/Dockerfile` builds and runs the cart application on port `3002`.

Both Dockerfiles use the repository root as their build context so pnpm can resolve the workspace lockfile and shared packages. Their build stages install dependencies with `pnpm install --frozen-lockfile` and build only the selected application. Their final stages contain the generated standalone server, its traced runtime files, and static assets; they do not copy the full source tree or the builder's complete dependency installation. The runners set `NODE_ENV=production`, bind to `0.0.0.0`, and run as the non-root `node` user.

Both Next.js configs use:

```js
output: "standalone"
outputFileTracingRoot: resolve(appDirectory, "../..")
```

The root is calculated from each config file at build time rather than hardcoded. Tracing from the monorepo root is required because runtime dependencies can come from `packages/` and the root pnpm installation. The generated entry points are `apps/home/server.js` and `apps/cart/server.js` inside their standalone output. Next.js does not copy `.next/static` into standalone automatically, so the Dockerfiles copy those assets separately.

### Cart Origin And Docker Networking

The home config reads `CART_ORIGIN` and defaults to `http://localhost:3002` for direct local development. Docker Compose builds home with:

```text
CART_ORIGIN=http://cart:3002
```

`cart` is the service name on Compose's private default network, so Docker DNS resolves it without Nginx, host networking, or a host alias. The browser still uses `http://localhost:3000`; only the server-side rewrite talks to `http://cart:3002`.

Next.js evaluates `rewrites()` during `next build` and records the destination in the route manifest. The home Dockerfile therefore declares `CART_ORIGIN` as a build argument and exports it in the builder stage. This value is effectively **build-time configuration** for the production image. Changing only a running container's environment does not update the compiled rewrite; rebuild the home image with the new argument.

### Build And Run

Build each image independently from the repository root:

```bash
docker build -f apps/home/Dockerfile \
  --build-arg CART_ORIGIN=http://cart:3002 \
  -t kayra-home .
docker build -f apps/cart/Dockerfile -t kayra-cart .
```

Build and start the composed production environment:

```bash
docker compose down --remove-orphans
docker compose build --no-cache
docker compose up -d
docker compose ps
docker compose logs home cart
```

Open the composed experience at `http://localhost:3000`. The independent cart service is also exposed at `http://localhost:3002/cart` for service-level verification. Stop and remove the environment with:

```bash
docker compose down --remove-orphans
```

### Healthchecks

The cart healthcheck requests `http://127.0.0.1:3002/cart`. Home waits for cart to become healthy, then its healthcheck requests `http://127.0.0.1:3000/`. Both checks use Node's built-in HTTP client, so the minimal runner images do not need `curl` or `wget`.

### Troubleshooting

- If port `3000` or `3002` is already in use, stop the local Next.js process or other container using that port before starting Compose.
- If `/cart` through port `3000` cannot reach cart, inspect `docker compose ps` and `docker compose logs home cart`; cart must be healthy and home must have been built with `CART_ORIGIN=http://cart:3002`.
- If the cart service name or internal port changes, rebuild home. Restarting the old image with a different environment value does not change its compiled rewrite manifest.
- If product requests fail, verify that containers and the browser can reach `https://fakestoreapi.com`. The home error state and cart retry state remain available when the external API is unavailable.
- If JavaScript or CSS under `/cart` returns 404, confirm that the cart standalone image includes `apps/cart/.next/static` and access cart through the `/cart` base path.

## Commands

Install dependencies:

```bash
pnpm install
```

Run home on port 3000:

```bash
pnpm --filter @kayra/home dev
```

Run cart on port 3002:

```bash
pnpm --filter @kayra/cart dev
```

Verify the Multi-Zone routing contract:

```bash
pnpm test:routes
```

Run all tests:

```bash
pnpm test
```

Run lint:

```bash
pnpm lint
```

Run typecheck:

```bash
pnpm typecheck
```

Build each app independently:

```bash
pnpm --filter @kayra/home build
pnpm --filter @kayra/cart build
```

Build all apps:

```bash
pnpm build
```

The Docker production commands are documented in [Production Containers](#production-containers).

## Architecture Trade-Offs

- Multi-Zone is simpler and more predictable with Next.js App Router than Module Federation for this assignment.
- Shared packages preserve explicit contracts without forcing the applications into one runtime.
- Standalone images are smaller and contain less build tooling than images that copy the complete workspace and run `next start`.
- Separate Dockerfiles duplicate a small amount of setup, but make each application's independent build and runtime contract obvious.
