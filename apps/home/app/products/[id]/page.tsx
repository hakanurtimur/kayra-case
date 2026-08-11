import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { CartLink } from "@/components/cart-link";
import { getProduct, parseProductId } from "@/lib/fake-store";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const productId = parseProductId(id);

  if (productId === null) {
    notFound();
  }

  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  return {
    title: `${product.title} | Kayra Shop`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const productId = parseProductId(id);

  if (productId === null) {
    notFound();
  }

  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-6 py-6 sm:px-8 lg:px-10">
      <main className="py-8 sm:py-12">
        <nav
          aria-label="Product navigation"
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <Link
            href="/"
            className="text-sm font-medium text-pine transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
          >
            Back to Products
          </Link>
          <CartLink />
        </nav>

        <article className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="relative aspect-square w-full">
              <Image
                src={product.image}
                alt={product.title}
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 90vw"
                className="object-contain"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium capitalize text-pine">
                {product.category}
              </p>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-normal text-ink sm:text-4xl">
                {product.title}
              </h1>
              <p className="text-2xl font-semibold text-ink">{price}</p>
            </div>

            <p className="max-w-3xl text-base leading-7 text-slate-600">
              {product.description}
            </p>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">
              <AddToCartButton
                productId={product.id}
                productTitle={product.title}
              />
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
