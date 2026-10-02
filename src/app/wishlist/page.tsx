import type { Metadata } from 'next';
import { getProducts } from '@/lib/store';
import { WishlistContent } from '@/components/products';
import { Breadcrumbs } from '@/components/editorial';
export const metadata: Metadata = { title: 'Your Saved Collection' };
export const dynamic = 'force-dynamic';
export default async function WishlistPage() {
  const products = await getProducts();
  return <main id="main-content" className="wishlist-page"><div className="container"><Breadcrumbs items={[{ label: 'Wishlist' }]} /><div className="page-heading"><span className="eyebrow">KEEP A LITTLE WONDER CLOSE</span><h1>Your saved collection.</h1><p>The pieces you love. The possibilities you’re dreaming of.</p></div><WishlistContent products={products} /></div></main>;
}
