import type { Metadata } from 'next';
import { getProducts } from '@/lib/store';
import { ProductCollection } from '@/components/products';
import { Breadcrumbs } from '@/components/editorial';
import { Icon } from '@/components/icons';
export const metadata: Metadata = { title: 'Search the Reef' };
export const dynamic = 'force-dynamic';
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const query = typeof q === 'string' ? q.trim().slice(0,200) : '';
  const products = await getProducts();
  return <main id="main-content" className="search-page"><div className="container"><Breadcrumbs items={[{ label: 'Search' }]} /><div className="page-heading"><span className="eyebrow">FOLLOW YOUR CURIOSITY</span><h1>{query ? `Discoveries for “${query}”` : 'A world to explore.'}</h1><p>Find your next favorite coral, marine companion, or reef essential.</p><form action="/search" method="get" className="search-form page-search"><Icon name="search" /><input aria-label="Search products" name="q" type="search" defaultValue={query} placeholder="Search by name, type, or keyword…" /><button className="button button-teal" type="submit">Search <Icon name="arrow" size={17} /></button></form></div><ProductCollection key={query} products={products} initialQuery={query} /></div></main>;
}
