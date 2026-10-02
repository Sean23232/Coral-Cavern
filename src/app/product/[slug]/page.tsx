import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/store';
import { categories } from '@/lib/catalog';
import { Breadcrumbs } from '@/components/editorial';
import { ProductDetail } from '@/components/product-detail';
import { ProductCard } from '@/components/products';
import { Icon } from '@/components/icons';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const product = await getProduct(slug); return { title: product?.name || 'Product', description: product?.description.slice(0,155) }; }
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const category = categories.find(c => c.slug === product.category)!;
  const related = (await getProducts()).filter(p => p.category === product.category && p.slug !== product.slug).slice(0,4);
  return <main id="main-content" className="product-page"><div className="container"><Breadcrumbs items={[{ label: 'Shop', href: '/shop' },{ label: category.name, href: `/shop/${category.slug}` },{ label: product.name }]} /><ProductDetail product={product} />{related.length > 0 && <section className="related-products section"><div className="section-heading"><div><span className="eyebrow">A LITTLE MORE TO LOVE</span><h2>Good company for your reef.</h2></div><Link href={`/shop/${category.slug}`} className="text-link">Explore the collection <Icon name="arrow" size={17} /></Link></div><div className="product-grid">{related.map(p => <ProductCard key={p.slug} product={p} />)}</div></section>}</div></main>;
}
