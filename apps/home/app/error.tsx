"use client";

import { CircleAlert, RotateCcw } from "lucide-react";
import { Container, StatePanel } from "@kayra/ui";

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main>
      <Container className="flex min-h-[calc(100vh-4.5rem)] items-center py-12">
        <StatePanel
          action={
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-5 text-sm font-bold text-white transition duration-200 ease-premium hover:-translate-y-0.5 hover:bg-ink/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <RotateCcw aria-hidden="true" size={17} />
              Try again
            </button>
          }
          description="The catalog is temporarily unavailable. Please try again in a moment."
          icon={<CircleAlert aria-hidden="true" size={24} />}
          title="We could not load the products"
          titleLevel={1}
          tone="danger"
        />
      </Container>
    </main>
  );
}
