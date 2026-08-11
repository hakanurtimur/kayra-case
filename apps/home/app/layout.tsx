import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@kayra/ui";
import { ToastProvider } from "@/components/toast-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kayra Shop",
  description: "A Multi-Zone e-commerce demo built with Next.js.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
        <ToastProvider />
      </body>
    </html>
  );
}
