import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProducts } from '@/lib/store';
import { categories } from '@/lib/catalog';
import { ProductCollection } from '@/components/products';
import { Breadcrumbs } from '@/components/editorial';
import { Icon } from '@/components/icons';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> { const { category } = await params; const data = categories.find(c => c.slug === category); return { title: data?.name || 'Collection', description: data?.description }; }
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const data = categories.find(c => c.slug === category);
  if (!data) notFound();
  const products = (await getProducts()).filter(p => p.category === category);
  return <main id="main-content"><section className="collection-hero"><img src={data.image} alt={data.name} fetchPriority="high" /><div className="collection-hero-shade" /><div className="container"><Breadcrumbs items={[{ label: 'Shop', href: '/shop' },{ label: data.name }]} /><span className="eyebrow">{data.short}</span><h1>{data.name}</h1><p>{data.description}</p></div></section><div className="container catalog-page"><nav className="category-navigation" aria-label="Shop categories"><Link href="/shop">The whole reef</Link>{categories.map(c => <Link href={`/shop/${c.slug}`} className={c.slug === category ? 'active' : ''} key={c.slug}>{c.name}</Link>)}</nav>{category === 'fish' && <div className="catalog-notice"><Icon name="fish" size={24} /><div><strong>Your next reef companion starts with a conversation.</strong><p>Explore our fish collections, then ask our team about species, compatibility, current pricing, and availability. Collection images are illustrative.</p></div><Link href="/contact?subject=Fish%20availability" className="text-link">Let’s talk fish <Icon name="arrow" size={16} /></Link></div>}<ProductCollection key={category} products={products} /><p className="catalog-source-note">{category === 'fish' ? 'Fish collections are inquiry-only; no unverified prices or stock are listed.' : 'Published catalog pricing and availability. Stock and shipping are confirmed before fulfillment. No payments are collected in this preview.'}</p><div className="related-categories"><span className="eyebrow">THERE’S MORE TO DISCOVER</span><h2>A whole reef of possibilities.</h2><div>{categories.filter(c => c.slug !== category).map(c => <Link href={`/shop/${c.slug}`} key={c.slug}><img src={c.image} alt={c.name} loading="lazy" /><span>{c.name}<Icon name="arrow" size={18} /></span></Link>)}</div></div></div></main>;
}
