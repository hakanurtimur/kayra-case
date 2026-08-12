import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { Store } from "lucide-react";
import { AppShell, StoreHeader } from "@kayra/ui";
import { CartLink } from "@/components/cart-link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cart | VEYRA",
  description: "Review your VEYRA cart.",
};

const homeHref = process.env.NEXT_PUBLIC_HOME_URL ?? "http://localhost:3000/";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AppShell>
          <StoreHeader
            activeSection="cart"
            brandMark={
              <Image
                src="/cart/veyra-mark.png"
                alt=""
                fill
                priority
                sizes="36px"
                className="object-contain"
              />
            }
            brandName="VEYRA"
            desktopCartAction={<CartLink variant="desktop" />}
            homeHref={homeHref}
            mobileCartAction={<CartLink variant="mobile" />}
            productsHref={homeHref}
            productsIcon={<Store aria-hidden="true" size={18} strokeWidth={2} />}
          />
          {children}
        </AppShell>
      </body>
    </html>
  );
}
