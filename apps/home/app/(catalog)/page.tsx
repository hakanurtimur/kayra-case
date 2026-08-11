import { CartLink } from "@/components/cart-link";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/fake-store";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-8 lg:px-10">
      <main className="flex-1 py-10 sm:py-14">
        <section className="flex flex-col gap-5 border-b border-slate-200 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-medium text-pine">Kayra Shop</p>
            <h1 className="text-3xl font-semibold tracking-normal text-ink sm:text-4xl">
              Products
            </h1>
            <p className="text-base leading-7 text-slate-600">
              Browse everyday picks across apparel, jewelry, and electronics in
              a clean catalog built for quick scanning.
            </p>
          </div>
          <CartLink />
        </section>

        {products.length > 0 ? (
          <section
            aria-label="Product catalog"
            className="grid gap-5 py-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        ) : (
          <section className="py-12">
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
              <h2 className="text-xl font-semibold text-ink">
                No products available
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
                The catalog is empty right now. Please check back once products
                are available from the API.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
