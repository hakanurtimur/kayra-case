import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-12 sm:px-8">
      <section
        aria-labelledby="product-not-found-heading"
        className="w-full rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8"
      >
        <p className="text-sm font-medium text-pine">Product not found</p>
        <h1
          id="product-not-found-heading"
          className="mt-3 text-2xl font-semibold tracking-normal text-ink"
        >
          This product is not available.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
          The product may have been removed, or the link may point to an invalid
          catalog item.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-md bg-pine px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
        >
          Back to Products
        </Link>
      </section>
    </div>
  );
}
