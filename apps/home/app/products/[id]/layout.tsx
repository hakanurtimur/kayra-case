import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { parseProductId } from "@/lib/fake-store";

type ProductLayoutProps = {
  children: ReactNode;
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductLayout({
  children,
  params,
}: ProductLayoutProps) {
  const { id } = await params;

  if (parseProductId(id) === null) {
    notFound();
  }

  return children;
}
