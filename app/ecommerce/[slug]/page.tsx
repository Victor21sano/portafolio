import { notFound } from "next/navigation";
import { EcommerceDemo } from "@/components/ecommerce/EcommerceDemo";
import { ecommerceDemos, getEcommerceDemo } from "@/lib/ecommerce-content";

export function generateStaticParams() {
  return ecommerceDemos.map((demo) => ({ slug: demo.slug }));
}

export default async function EcommerceDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const demo = getEcommerceDemo(slug);
  if (!demo) notFound();

  return <EcommerceDemo demo={demo} view="dashboard" />;
}
