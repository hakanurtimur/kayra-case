import type { ReactNode } from "react";
import { Container } from "./container";

type StoreHeaderProps = {
  activeSection: "cart" | "products";
  brandMark: ReactNode;
  brandName: string;
  desktopCartAction: ReactNode;
  homeHref: string;
  mobileCartAction: ReactNode;
  productsHref: string;
  productsIcon: ReactNode;
};

export function StoreHeader({
  activeSection,
  brandMark,
  brandName,
  desktopCartAction,
  homeHref,
  mobileCartAction,
  productsHref,
  productsIcon,
}: StoreHeaderProps) {
  return (
    <>
      <div className="bg-ink text-white">
        <Container className="flex min-h-8 items-center justify-center text-center text-[11px] font-semibold sm:justify-between sm:text-xs">
          <p>Complimentary delivery on orders over $100</p>
          <p className="hidden text-white/65 sm:block">
            Curated essentials, considered service
          </p>
        </Container>
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-canvas">
        <Container className="flex h-16 items-center justify-between sm:h-[4.5rem]">
          <a
            href={homeHref}
            aria-label={`${brandName} home`}
            className="inline-flex min-h-11 items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <span className="relative block h-9 w-9 shrink-0">{brandMark}</span>
            <span className="text-lg font-black text-ink">{brandName}</span>
          </a>

          <nav
            aria-label="Store navigation"
            className="hidden items-center gap-2 sm:flex"
          >
            <a
              href={productsHref}
              aria-current={activeSection === "products" ? "page" : undefined}
              className={`inline-flex min-h-11 items-center rounded-md px-4 text-sm font-semibold transition duration-200 ease-premium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                activeSection === "products"
                  ? "bg-surface text-ink shadow-soft"
                  : "text-muted hover:bg-surface hover:text-ink"
              }`}
            >
              Shop
            </a>
            {desktopCartAction}
          </nav>
        </Container>
      </header>

      <nav
        aria-label="Mobile store navigation"
        className="fixed inset-x-4 bottom-3 z-40 grid h-16 grid-cols-2 gap-1 rounded-lg bg-ink p-1.5 text-white shadow-lift sm:hidden"
      >
        <a
          href={productsHref}
          aria-current={activeSection === "products" ? "page" : undefined}
          className={`flex min-w-0 items-center justify-center gap-2 rounded-md px-3 text-xs font-semibold transition duration-200 ease-premium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            activeSection === "products"
              ? "bg-accent text-ink"
              : "text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          {productsIcon}
          <span>Shop</span>
        </a>
        {mobileCartAction}
      </nav>
    </>
  );
}
