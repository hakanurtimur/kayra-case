import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@kayra/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cart | Kayra Shop",
  description: "The cart zone for the Kayra Multi-Zone commerce demo.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
