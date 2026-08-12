import Link from "next/link";
import { ArrowLeft, PackageX } from "lucide-react";
import { Container, StatePanel } from "@kayra/ui";

export default function ProductNotFound() {
  return (
    <main>
      <Container className="flex min-h-[calc(100vh-4.5rem)] items-center py-12">
        <StatePanel
          action={
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-5 text-sm font-bold text-white transition duration-200 ease-premium hover:-translate-y-0.5 hover:bg-ink/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <ArrowLeft aria-hidden="true" size={17} />
              Back to products
            </Link>
          }
          description="The product may have been removed, or this link may point to an invalid catalog item."
          icon={<PackageX aria-hidden="true" size={24} />}
          title="This product is not available"
          titleLevel={1}
        />
      </Container>
    </main>
  );
}
