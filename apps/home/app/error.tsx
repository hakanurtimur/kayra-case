"use client";

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-12 sm:px-8">
      <section
        aria-labelledby="catalog-error-heading"
        className="w-full rounded-lg border border-red-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <p className="text-sm font-medium text-red-700">Catalog unavailable</p>
        <h1
          id="catalog-error-heading"
          className="mt-3 text-2xl font-semibold tracking-normal text-ink"
        >
          We could not load the products.
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {error.message || "Please try again in a moment."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-md bg-pine px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
        >
          Try Again
        </button>
      </section>
    </div>
  );
}
