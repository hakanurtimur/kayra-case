import { PackageCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { Container } from "@kayra/ui";

const benefits = [
  {
    description: "Ready to leave in 1-2 days",
    icon: PackageCheck,
    title: "Fast dispatch",
  },
  {
    description: "Simple returns within 30 days",
    icon: RefreshCw,
    title: "Easy returns",
  },
  {
    description: "Protected payment experience",
    icon: ShieldCheck,
    title: "Secure pay",
  },
];

export function TrustStrip() {
  return (
    <section aria-label="Shopping benefits" className="border-b border-line">
      <Container className="grid grid-cols-3 divide-x divide-line py-4 sm:py-5">
        {benefits.map(({ description, icon: Icon, title }) => (
          <div
            key={title}
            className="flex min-w-0 items-center justify-center gap-2 px-2 first:pl-0 last:pr-0 sm:gap-3 sm:px-5"
          >
            <Icon
              aria-hidden="true"
              size={19}
              strokeWidth={1.9}
              className="shrink-0 text-ink sm:h-5 sm:w-5"
            />
            <div className="min-w-0">
              <p className="truncate text-[11px] font-black text-ink sm:text-sm">
                {title}
              </p>
              <p className="mt-0.5 hidden text-xs text-muted md:block">
                {description}
              </p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
