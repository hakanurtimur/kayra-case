import { PackageOpen } from "lucide-react";
import { Container, StatePanel } from "@kayra/ui";
import { CatalogHero } from "@/components/catalog-hero";
import { CategoryShowcase } from "@/components/category-showcase";
import { CategoryNav } from "@/components/category-nav";
import { PopularShelf } from "@/components/popular-shelf";
import { ProductCard } from "@/components/product-card";
import { StoreFooter } from "@/components/store-footer";
import { TrustStrip } from "@/components/trust-strip";
import {
  catalogCategories,
  filterCatalogProducts,
  getFeaturedProduct,
  getPopularProducts,
  parseCatalogCategory,
  type CatalogCategory,
} from "@/lib/catalog";
import { getProducts } from "@/lib/fake-store";

type HomePageProps = {
  searchParams: Promise<{
    category?: string | string[];
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category } = await searchParams;
  const products = await getProducts();
  const selectedCategory = parseCatalogCategory(category);
  const visibleProducts = filterCatalogProducts(products, selectedCategory);
  const featuredProduct = getFeaturedProduct(products);
  const popularProducts = getPopularProducts(products);
  const activeCategory = catalogCategories.find(
    (candidate) => candidate.slug === selectedCategory,
  );
  const categoryCounts = Object.fromEntries(
    catalogCategories.map((candidate) => [
      candidate.slug,
      filterCatalogProducts(products, candidate.slug).length,
    ]),
  ) as Record<CatalogCategory, number>;
  const categoryFeatures = catalogCategories.flatMap((candidate) => {
    if (!candidate.value) {
      return [];
    }

    const product = products.find(
      (catalogProduct) => catalogProduct.category === candidate.value,
    );

    return product
      ? [
          {
            count: categoryCounts[candidate.slug],
            label: candidate.label,
            product,
            slug: candidate.slug,
          },
        ]
      : [];
  });

  return (
    <main>
      {featuredProduct ? <CatalogHero product={featuredProduct} /> : null}
      <CategoryShowcase categories={categoryFeatures} />
      <PopularShelf products={popularProducts} />
      <CategoryNav
        counts={categoryCounts}
        selectedCategory={selectedCategory}
      />

      <Container className="pb-16 pt-8 sm:pb-20 sm:pt-10 lg:pt-12">
        <section
          id="catalog"
          className="flex items-end justify-between gap-4 scroll-mt-24"
        >
          <div>
            <p className="text-sm font-bold text-muted">
              {selectedCategory === "all" ? "The full edit" : "Filtered edit"}
            </p>
            <h2 className="mt-1 text-3xl font-black text-ink sm:text-4xl">
              {selectedCategory === "all"
                ? "Shop all"
                : `Shop ${activeCategory?.label.toLowerCase() ?? "all"}`}
            </h2>
          </div>
          <p className="shrink-0 text-sm font-bold text-muted">
            {visibleProducts.length} {visibleProducts.length === 1 ? "piece" : "pieces"}
          </p>
        </section>

        {visibleProducts.length > 0 ? (
          <section
            aria-label="Product catalog"
            className="grid grid-cols-2 gap-x-3 gap-y-8 pt-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 sm:pt-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12"
          >
            {visibleProducts.map((product, index) => (
              <ProductCard key={product.id} index={index} product={product} />
            ))}
          </section>
        ) : (
          <div className="py-12">
            <StatePanel
              description="The catalog is empty right now. Check back once products are available."
              icon={<PackageOpen aria-hidden="true" size={24} />}
              title="No pieces in this edit"
            />
          </div>
        )}
      </Container>
      <TrustStrip />
      <StoreFooter />
    </main>
  );
}
