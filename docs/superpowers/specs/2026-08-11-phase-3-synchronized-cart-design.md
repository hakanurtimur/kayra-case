# Phase 3 Synchronized Cart Design

## Scope

Phase 3 adds a working cart across the independently built home and cart Next.js applications. The composed browser experience remains on the home origin: `/` and `/products/[id]` are served by home, while `/cart` is rewritten to the cart zone. Docker and Phase 4 work are out of scope.

## Cart Contract

`packages/cart-contract` is framework-agnostic and stores only cart identity and quantity:

```ts
type CartItem = {
  productId: number;
  quantity: number;
};
```

The public API is `readCart`, `writeCart`, `addToCart`, `updateCartItem`, `removeFromCart`, `clearCart`, `subscribeToCartChanges`, and `getCartItemCount`.

Persistence uses a versioned `localStorage` key. All browser APIs are guarded for server rendering. Reads treat invalid JSON and unavailable storage as an empty cart. Normalization rejects non-positive or non-integer IDs and quantities, merges duplicate product IDs, and prevents invalid values from reaching consumers. Updating to zero or less removes the line.

## Synchronization

`writeCart` persists normalized data and dispatches a same-document `CustomEvent`. `subscribeToCartChanges` listens to that event and to the browser `storage` event, filtering storage notifications to the cart key. React consumers subscribe through a small client hook and read fresh snapshots from `localStorage`.

Home-to-cart navigation uses a normal `<a href="/cart">`. The browser performs a hard cross-zone navigation through the home origin; the cart client boundary mounts and reads the already-persisted state. Other tabs on the same origin receive the `storage` event. Direct access to ports 3000 and 3001 does not synchronize because `localStorage` is origin-scoped.

## Home Application

Product listing and detail pages remain Server Components. A focused `AddToCartButton` Client Component receives `productId` and `productTitle`, calls the shared contract, exposes pending feedback, and shows a success toast. A focused cart-link Client Component subscribes to cart changes and renders total quantity. Internal product links keep using `next/link`; the cross-zone cart link is a normal anchor.

The toast provider is a small client boundary in the home layout. Sonner is the only toast dependency because no toast primitive is currently installed.

## Cart Application

The cart route remains `apps/cart/app/page.tsx` under `basePath: "/cart"`. The page keeps a server shell and renders one interactive cart client boundary.

The boundary reads stored cart IDs after mount, subscribes to changes, and uses TanStack Query to fetch the small Fake Store catalog once. It maps products against cart IDs, renders responsive cart lines, and exposes increment, decrement, remove, and clear actions. Missing product records are omitted from enriched lines while the stored cart remains intact; a catalog request failure produces a retryable API error state.

The QueryClient provider wraps only the cart's interactive subtree. Loading is split into storage hydration and catalog loading states. Empty, error, populated, and feedback states are explicit and accessible.

## State Management Decision

Redux and Zustand are not needed. The durable cart state has a tiny API and is already represented by a framework-independent external store. Adding a React global store would duplicate that state and would not create a shared runtime between separately built zones.

TanStack Query is justified only in the cart app because product IDs originate in client-owned storage and product data must be fetched after that read. The home catalog remains server-fetched. A production backend would normally own cart state and return enriched lines or provide efficient batch product lookup.

## Testing And Verification

Cart-contract tests cover empty and corrupt storage, validation, duplicate normalization, mutations, notification, and count behavior. Structural routing tests verify that home uses a normal anchor for `/cart` and does not import `next/link` for that cross-zone control.

Automated verification runs all tests, lint, typecheck, independent home and cart builds, and the workspace build. Manual browser verification covers add/count behavior, duplicate increments, product detail adds, hard zone navigation persistence, quantity controls, remove, clear, refresh persistence, another-tab synchronization where possible, `/cart/cart` returning 404, and console/hydration cleanliness.

## Limitations

This task uses browser-local persistence, so it is single-origin and single-browser only. It does not support authenticated carts, multiple devices, server reconciliation, inventory validation, or checkout-safe pricing. Production cart state should be backend-owned.
