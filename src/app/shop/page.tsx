import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/store';
import { categories } from '@/lib/catalog';
import { ProductCollection } from '@/components/products';
import { Breadcrumbs } from '@/components/editorial';
import { Icon } from '@/components/icons';
export const metadata: Metadata = { title: 'Explore the Collection' };
export const dynamic = 'force-dynamic';
export default async function ShopPage() {
  const products = await getProducts();
  return <main id="main-content"><section className="collection-hero"><img src="/images/reef-hero.jpg" alt="A natural coral reef" /><div className="collection-hero-shade" /><div className="container"><Breadcrumbs items={[{ label: 'Shop' }]} /><span className="eyebrow">A WORLD OF POSSIBILITIES</span><h1>Find your little ocean.</h1><p>Extraordinary marine life and thoughtful essentials.<br />Everything your reef’s next chapter needs.</p></div></section><div className="container catalog-page"><nav className="category-navigation" aria-label="Shop categories"><Link href="/shop" className="active">The whole reef</Link>{categories.map(c => <Link href={`/shop/${c.slug}`} key={c.slug}>{c.name}<Icon name="arrow-up" size={14} /></Link>)}</nav><ProductCollection products={products} /><p className="catalog-source-note">Prices and stock reflect Coral Cavern’s published catalog, not a live inventory feed. Fish collections are inquiry-only. Availability is confirmed before fulfillment; this preview does not collect payment.</p></div></main>;
}
