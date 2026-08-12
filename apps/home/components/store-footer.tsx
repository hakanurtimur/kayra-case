import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@kayra/ui";

const categoryLinks = [
  { href: "/?category=women#catalog", label: "Women" },
  { href: "/?category=men#catalog", label: "Men" },
  { href: "/?category=jewelry#catalog", label: "Jewelry" },
  { href: "/?category=tech#catalog", label: "Tech" },
];

export function StoreFooter() {
  return (
    <footer className="bg-ink text-white">
      <Container className="grid gap-8 py-10 sm:grid-cols-[1.4fr_0.7fr_0.9fr] sm:py-12">
        <div className="max-w-sm">
          <a
            href="/"
            aria-label="VEYRA home"
            className="inline-flex min-h-11 items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="relative block h-9 w-9">
              <Image
                src="/veyra-mark.png"
                alt=""
                fill
                sizes="36px"
                className="object-contain"
              />
            </span>
            <span className="text-lg font-black">VEYRA</span>
          </a>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Useful pieces, selected with intent. A focused storefront for
            everyday life.
          </p>
        </div>

        <nav aria-label="Footer categories">
          <h2 className="text-sm font-black">Shop</h2>
          <ul className="mt-3 space-y-2.5">
            {categoryLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-white/60 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-black">Your order</h2>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Fast dispatch, secure payment, and simple returns within 30 days.
          </p>
          <a
            href="/cart"
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-accent px-4 text-sm font-black text-ink transition-colors hover:bg-accent-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            View cart
            <ArrowUpRight aria-hidden="true" size={17} />
          </a>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex min-h-12 items-center justify-between gap-4 text-[11px] text-white/45 sm:text-xs">
          <p>VEYRA storefront</p>
          <p>Built for a focused shopping experience</p>
        </Container>
      </div>
    </footer>
  );
}
