import { CartExperience } from "@/components/cart-experience";
import { CartProviders } from "@/components/cart-providers";

const homeHref = process.env.NEXT_PUBLIC_HOME_URL ?? "http://localhost:3000/";

export default function CartPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-8 lg:px-10">
      <header className="border-b border-slate-200 pb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-pine">
          Kayra Shop
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal text-ink sm:text-4xl">
          Cart
        </h1>
      </header>

      <main className="flex-1 py-10 sm:py-14">
        <CartProviders>
          <CartExperience homeHref={homeHref} />
        </CartProviders>
      </main>
    </div>
  );
}
