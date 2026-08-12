import Image from "next/image";
import Link from "next/link";
import type { Product } from "@kayra/types";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@kayra/ui";
import type { CatalogCategory } from "@/lib/catalog";

type CategoryFeature = {
  count: number;
  label: string;
  product: Product;
  slug: Exclude<CatalogCategory, "all">;
};

type CategoryShowcaseProps = {
  categories: CategoryFeature[];
};

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  return (
    <section className="border-b border-line bg-surface py-6 sm:py-8">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-muted sm:text-sm">
              Find your lane
            </p>
            <h2 className="mt-1 text-2xl font-black text-ink sm:text-3xl">
              Shop categories
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm leading-6 text-muted md:block">
            Four focused edits, one concise catalog.
          </p>
        </div>

        <div className="-mx-4 mt-5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="grid grid-flow-col auto-cols-[66%] gap-3 sm:grid-flow-row sm:grid-cols-4 sm:gap-4">
            {categories.map(({ count, label, product, slug }, index) => (
              <Link
                key={slug}
                href={`/?category=${slug}#catalog`}
                className="group grid h-36 grid-cols-[0.9fr_1.1fr] overflow-hidden rounded-lg bg-stage focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:h-40"
              >
                <div className="flex min-w-0 flex-col justify-between bg-ink p-3.5 text-white sm:p-4">
                  <span className="text-[11px] font-semibold text-white/55 sm:text-xs">
                    {count} pieces
                  </span>
                  <div>
                    <h3 className="text-lg font-black sm:text-xl">{label}</h3>
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-accent sm:text-xs">
                      Explore
                      <ArrowUpRight aria-hidden="true" size={14} />
                    </span>
                  </div>
                </div>
                <div className="relative overflow-hidden bg-stage">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    priority={index < 2}
                    sizes="(min-width: 640px) 15vw, 36vw"
                    className="object-contain p-3 transition-transform duration-500 ease-premium group-hover:scale-[1.06] sm:p-4"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
