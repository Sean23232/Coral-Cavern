import type { Metadata } from 'next';
import { CheckoutFlow } from '@/components/commerce';
import { Breadcrumbs } from '@/components/editorial';
export const metadata: Metadata = { title: 'Checkout', robots: { index: false, follow: false } };
export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ method?: string }> }) {
  const { method } = await searchParams;
  return <main id="main-content" className="checkout-page"><div className="container"><Breadcrumbs items={[{ label: 'Your bag', href: '/cart' },{ label: 'Checkout' }]} /><CheckoutFlow initialMethod={method} /></div></main>;
}
