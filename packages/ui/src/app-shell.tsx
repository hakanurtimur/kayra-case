import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-canvas pb-24 text-ink antialiased sm:pb-0">
      {children}
    </div>
  );
}
