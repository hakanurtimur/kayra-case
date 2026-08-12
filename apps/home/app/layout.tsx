import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { Store } from "lucide-react";
import { AppShell, StoreHeader } from "@kayra/ui";
import { CartLink } from "@/components/cart-link";
import { ToastProvider } from "@/components/toast-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "VEYRA",
  description: "Considered everyday essentials from VEYRA.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AppShell>
          <StoreHeader
            activeSection="products"
            brandMark={
              <Image
                src="/veyra-mark.png"
                alt=""
                fill
                priority
                sizes="36px"
                className="object-contain"
              />
            }
            brandName="VEYRA"
            desktopCartAction={<CartLink variant="desktop" />}
            homeHref="/"
            mobileCartAction={<CartLink variant="mobile" />}
            productsHref="/"
            productsIcon={<Store aria-hidden="true" size={18} strokeWidth={2} />}
          />
          {children}
        </AppShell>
        <ToastProvider />
      </body>
    </html>
  );
}
