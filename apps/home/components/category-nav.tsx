import Link from "next/link";
import { Container } from "@kayra/ui";
import {
  catalogCategories,
  type CatalogCategory,
} from "@/lib/catalog";

type CategoryNavProps = {
  counts: Record<CatalogCategory, number>;
  selectedCategory: CatalogCategory;
};

export function CategoryNav({
  counts,
  selectedCategory,
}: CategoryNavProps) {
  return (
    <section className="border-b border-line bg-surface">
      <Container className="flex items-center gap-4 py-3 sm:py-4">
        <p className="hidden shrink-0 text-sm font-bold text-ink lg:block">
          Shop by category
        </p>
        <nav
          aria-label="Product categories"
          className="min-w-0 flex-1 overflow-x-auto"
        >
          <div className="inline-flex min-w-max items-center gap-1 rounded-lg bg-canvas p-1">
            {catalogCategories.map((category) => {
              const isActive = selectedCategory === category.slug;
              const href =
                category.slug === "all"
                  ? "/#catalog"
                  : `/?category=${category.slug}#catalog`;

              return (
                <Link
                  key={category.slug}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-xs font-bold transition-colors duration-200 ease-premium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:px-4 sm:text-sm ${
                    isActive
                      ? "bg-ink text-white"
                      : "text-muted hover:bg-surface hover:text-ink"
                  }`}
                >
                  <span>{category.label}</span>
                  <span
                    className={`text-[10px] font-bold sm:text-xs ${
                      isActive ? "text-accent" : "text-muted"
                    }`}
                  >
                    {counts[category.slug]}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </Container>
    </section>
  );
}
