# Kayra Micro-Frontend Commerce Demo

Kayra is a frontend take-home project built as a small e-commerce demo with two independently buildable Next.js applications:

- `apps/home` serves the shopping experience on port `3000`.
- `apps/cart` serves the cart zone on port `3001`.

This repository is currently at **Phase 3: synchronized cart micro-frontend**. Docker and final UI polish remain out of scope until later phases.

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

## Multi-Zone Routing

This project uses **Next.js Multi-Zone**, not Module Federation. Multi-Zone keeps each frontend independently buildable and deployable while letting one origin compose the user-facing routes.

For local Phase 1 development:

- Home runs at `http://localhost:3000`.
- Cart runs at `http://localhost:3001/cart`.
- Home rewrites `/cart/:path*` to `http://localhost:3001/cart/:path*`.

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
- `http://localhost:3001/cart`

`localStorage` is scoped per origin and cannot be shared between them. This means an item added on direct port 3000 is not visible when the cart app is opened directly on port 3001.

`localStorage` is only a task-level persistence mechanism. A production implementation would normally make cart state backend-owned so authenticated users can persist across origins, deployments, sessions, and devices. A cart API would also reconcile inventory and pricing, and would normally return enriched cart lines or support efficient batch product lookup.

## Server and Client Components

Product listing and product detail are implemented as Server Components. They fetch product data on the server through `apps/home/lib/fake-store.ts`.

TanStack Query remains intentionally absent from the home product listing and detail routes. Those routes do not need client-side refetching, optimistic updates, polling, filtering, or user-specific server state. Keeping their data fetching on the server reduces client bundle weight and lets Next.js own caching and rendering behavior.

The product listing uses `fetch` with `next.revalidate: 300`, so the home route is prerendered with a five-minute revalidation window. Product detail pages also use the shared API layer and are server-rendered on demand for dynamic IDs. Client Components are introduced only where required by Next.js, such as the route-level error boundary.

Home adds Client Components only for Add to Cart actions, the live cart count, storage subscriptions, and toast feedback. Product cards and product detail rendering remain Server Components.

## Cart Product Data And State Management

The cart application uses TanStack Query inside its interactive client boundary. This is justified because cart identity is client-owned in `localStorage`: the product IDs are known only after hydration, and the associated product information must then be loaded in the browser. The assignment's Fake Store catalog is small, so one `GET https://fakestoreapi.com/products` request is simpler and more maintainable than one request per cart line. The QueryClient provider does not wrap the entire application layout.

Redux and Zustand are not used. The durable cart has a small framework-independent contract, and React only needs a `useState`/`useEffect` subscription bridge. A global store would duplicate that state and would not make two independently built zones share a runtime. For a production system, the backend cart API and a server-state cache would replace browser storage as the source of truth.

## Commands

Install dependencies:

```bash
pnpm install
```

Run home on port 3000:

```bash
pnpm --filter @kayra/home dev
```

Run cart on port 3001:

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

## Phase 1 Trade-Offs

- Multi-Zone is simpler and more predictable with Next.js App Router than Module Federation for this assignment.
- Shared packages are intentionally small in Phase 1. They establish workspace boundaries without adding placeholder product or cart implementations.
- Cart synchronization is documented now, but implemented later so Phase 1 stays focused on the foundation.
