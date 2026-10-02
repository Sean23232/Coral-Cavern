import type { Metadata } from 'next';
import { CartContent } from '@/components/commerce';
import { Breadcrumbs } from '@/components/editorial';
export const metadata: Metadata = { title: 'Your Reef Bag' };
export default function CartPage() {
  return <main id="main-content" className="cart-page"><div className="container"><Breadcrumbs items={[{ label: 'Your bag' }]} /><div className="page-heading"><span className="eyebrow">A FEW THOUGHTFUL ADDITIONS</span><h1>Your next reef chapter.</h1><p>A little color. A little character. A whole lot of possibility.</p></div><CartContent /></div></main>;
}
