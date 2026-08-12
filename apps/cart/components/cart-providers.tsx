"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";
import { Toaster } from "sonner";

type CartProvidersProps = {
  children: ReactNode;
};

export function CartProviders({ children }: CartProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
      <Toaster
        closeButton
        mobileOffset={{ left: 16, right: 16, top: 76 }}
        offset={{ right: 24, top: 88 }}
        position="top-right"
        toastOptions={{
          classNames: {
            closeButton: "!border-0 !bg-surface !text-ink",
            description: "!text-white/70",
            title: "!font-bold !text-white",
            toast: "!rounded-lg !border-0 !bg-ink !text-white !shadow-lift",
          },
        }}
      />
    </QueryClientProvider>
  );
}
