import { Container } from "@kayra/ui";
import { CartExperience } from "@/components/cart-experience";
import { CartProviders } from "@/components/cart-providers";

const homeHref = process.env.NEXT_PUBLIC_HOME_URL ?? "http://localhost:3000/";

export default function CartPage() {
  return (
    <main>
      <Container className="py-8 sm:py-12 lg:py-14">
        <header className="border-b border-line pb-7 sm:pb-9">
          <h1 className="text-4xl font-black text-ink sm:text-5xl">Your cart</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
            Adjust quantities, remove items, and review your current subtotal.
          </p>
        </header>

        <div className="pt-6 sm:pt-8">
          <CartProviders>
            <CartExperience homeHref={homeHref} />
          </CartProviders>
        </div>
      </Container>
    </main>
  );
}
