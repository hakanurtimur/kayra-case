"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
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
  );
}
