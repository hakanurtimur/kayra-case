import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, PackageCheck, RefreshCw, Star } from "lucide-react";
import { Container } from "@kayra/ui";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { MotionSurface } from "@/components/motion-surface";
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
    title: `${product.title} | VEYRA`,
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
    <main>
      <Container className="pb-24 pt-6 sm:py-10 lg:py-12">
        <nav aria-label="Product navigation" className="flex items-center">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-sm font-bold text-ink transition-colors hover:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ArrowLeft aria-hidden="true" size={18} />
            Back to products
          </Link>
        </nav>

        <article className="mt-5 grid gap-7 lg:mt-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:items-start lg:gap-12">
          <MotionSurface>
            <div className="overflow-hidden rounded-lg bg-stage p-5 sm:p-8 lg:p-12">
              <div className="relative aspect-[4/3] w-full sm:aspect-square">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  priority
                  sizes="(min-width: 1280px) 46vw, (min-width: 1024px) 50vw, 92vw"
                  className="object-contain transition duration-700 ease-premium hover:scale-[1.025]"
                />
              </div>
            </div>
          </MotionSurface>

          <div className="lg:sticky lg:top-28">
            <div>
              <p className="inline-flex rounded-md bg-accent-soft px-3 py-1.5 text-xs font-bold capitalize text-ink">
                {product.category}
              </p>
              <h1 className="mt-4 max-w-2xl text-2xl font-black leading-tight text-ink sm:text-4xl">
                {product.title}
              </h1>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <span
                  aria-label={`${product.rating.rate.toFixed(1)} out of 5 stars`}
                  className="inline-flex items-center gap-1.5 font-bold text-ink"
                >
                  <Star
                    aria-hidden="true"
                    size={16}
                    fill="currentColor"
                    className="text-accent-strong"
                  />
                  {product.rating.rate.toFixed(1)}
                </span>
                <span className="text-muted">
                  {product.rating.count} ratings
                </span>
              </div>
              <p className="mt-5 text-3xl font-black text-ink">{price}</p>
            </div>

            <p className="mt-6 max-w-xl text-sm leading-7 text-muted first-letter:uppercase sm:text-base">
              {product.description}
            </p>

            <div className="mt-7 border-t border-line pt-6">
              <div>
                <AddToCartButton
                  productId={product.id}
                  productTitle={product.title}
                  variant="detail"
                />
              </div>
              <p className="mt-3 text-xs leading-5 text-muted">
                Your cart stays available while you move between storefront
                zones.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 divide-x divide-line border-y border-line py-4">
              <div className="flex items-center gap-3 pr-4">
                <PackageCheck
                  aria-hidden="true"
                  size={20}
                  className="shrink-0 text-ink"
                />
                <div>
                  <p className="text-xs font-black text-ink sm:text-sm">
                    Fast dispatch
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted sm:text-xs">
                    Leaves in 1-2 days
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-4">
                <RefreshCw
                  aria-hidden="true"
                  size={19}
                  className="shrink-0 text-ink"
                />
                <div>
                  <p className="text-xs font-black text-ink sm:text-sm">
                    Easy returns
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted sm:text-xs">
                    Within 30 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </Container>
    </main>
  );
}
