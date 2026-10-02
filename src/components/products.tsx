'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { type Product, money } from '@/lib/catalog';
import { useStore } from './store-provider';
import { Icon } from './icons';

export function ProductCard({ product }: { product: Product }) {
  const { add, wishlist, toggleWish, setQuickView } = useStore();
  const saved = wishlist.includes(product.slug);
  return <article className="product-card"><div className="product-image-wrap"><Link href={`/product/${product.slug}`} className="product-image-link" aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} loading="lazy" /></Link><span className="product-type-badge">{product.type.replace('corals', 'coral')}</span><button className={`product-wish ${saved ? 'is-saved' : ''}`} onClick={() => toggleWish(product.slug)} aria-label={`${saved ? 'Remove' : 'Save'} ${product.name} ${saved ? 'from' : 'to'} wishlist`} aria-pressed={saved}><Icon name="heart" size={18} /></button><button className="quick-view-trigger" onClick={() => setQuickView(product)}><Icon name="eye" size={17} />Quick view</button></div><div className="product-card-body"><span className="mini-label">{product.category === 'corals' ? 'A LIVING WORK OF ART' : product.category === 'supplies' ? 'THOUGHTFUL REEF ESSENTIALS' : 'MEET YOUR REEF’S NEXT RESIDENT'}</span><Link href={`/product/${product.slug}`}><h3>{product.name}</h3></Link><div className="product-bottom"><div><span className="card-price">{money(product.price)}</span><span className={`availability ${product.available ? 'available' : ''}`}><i />{product.available ? 'Available' : product.inquiry ? 'Inquire for availability' : 'Out of stock'}</span></div>{product.available ? <button className="card-add" aria-label={`Add ${product.name} to cart`} onClick={() => add(product)}><Icon name="plus" size={20} /><span>Add to cart</span></button> : <Link className="card-add" href={`/product/${product.slug}`} aria-label={`View ${product.name}`}><Icon name="arrow" size={20} /><span>{product.inquiry ? 'Explore' : 'View coral'}</span></Link>}</div></div></article>;
}
export function ProductCollection({ products, featured = false, initialQuery = '' }: { products: Product[]; featured?: boolean; initialQuery?: string }) {
  const [type, setType] = useState('All');
  const [sort, setSort] = useState('featured');
  const [availability, setAvailability] = useState(false);
  const [search, setSearch] = useState(initialQuery);
  const [price, setPrice] = useState('all');
  const [limit, setLimit] = useState(featured ? 4 : 12);
  const [showFilters, setShowFilters] = useState(false);
  const types = [...new Set(products.map(p => p.type))];
  const reset = () => { setType('All'); setSort('featured'); setAvailability(false); setSearch(''); setPrice('all'); setLimit(featured ? 4 : 12); };
  const filtered = useMemo(() => {
    let results = products.filter(p => (type === 'All' || p.type === type) && (!availability || p.available) && (!search || `${p.name} ${p.category} ${p.type} ${p.description}`.toLowerCase().includes(search.toLowerCase())) && (price === 'all' || (p.price !== null && (price === 'under100' ? p.price < 10000 : price === '100to250' ? p.price >= 10000 && p.price <= 25000 : p.price > 25000))));
    if (sort === 'price-low') results = results.sort((a,b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sort === 'price-high') results = results.sort((a,b) => (b.price ?? -1) - (a.price ?? -1));
    if (sort === 'name') results = results.sort((a,b) => a.name.localeCompare(b.name));
    if (sort === 'available') results = results.sort((a,b) => Number(b.available) - Number(a.available));
    return results;
  }, [products, type, sort, availability, search, price]);
  return <div className={`product-collection ${featured ? 'featured-collection' : ''}`}>
    <div className="collection-toolbar"><div className="collection-tabs" aria-label="Product type filters"><button className={type === 'All' && !availability ? 'active' : ''} onClick={() => { setType('All'); setAvailability(false); setLimit(featured ? 4 : 12); }}>{featured ? 'All corals' : 'All products'}</button>{types.slice(0, featured ? 2 : 5).map(t => <button key={t} className={type === t ? 'active' : ''} onClick={() => { setType(t); setAvailability(false); setLimit(featured ? 4 : 12); }}>{t}</button>)}{featured && <button className={availability ? 'active' : ''} onClick={() => { setType('All'); setAvailability(true); }}>Available now</button>}</div><div className="toolbar-right">{!featured && <button className={`filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters}><Icon name="filter" size={17} /> Filters</button>}<label className="sort-select"><span>Sort by:</span><select aria-label="Sort products" value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A–Z</option><option value="available">Availability</option></select></label></div></div>
    {!featured && showFilters && <div className="filter-panel"><label>Search this collection<div className="filter-search"><Icon name="search" size={18} /><input placeholder="Name, type, or keyword" value={search} onChange={e => { setSearch(e.target.value); setLimit(12); }} /></div></label><label>Price range<select value={price} onChange={e => setPrice(e.target.value)}><option value="all">All prices</option><option value="under100">Under $100</option><option value="100to250">$100–$250</option><option value="over250">Over $250</option></select></label><label className="checkbox-label"><input type="checkbox" checked={availability} onChange={e => setAvailability(e.target.checked)} /> Available products only</label><button className="text-button" onClick={reset}>Reset filters</button></div>}
    {!featured && <div className="results-meta"><span>{filtered.length} {filtered.length === 1 ? 'discovery' : 'discoveries'}{search ? ` for “${search}”` : ''}</span>{(type !== 'All' || availability || search || price !== 'all') && <button className="text-button" onClick={reset}>Clear all filters <Icon name="close" size={12} /></button>}<span>Thoughtfully chosen. Naturally extraordinary.</span></div>}
    {filtered.length ? <div className="product-grid">{filtered.slice(0, limit).map(p => <ProductCard product={p} key={p.slug} />)}</div> : <div className="empty-state"><Icon name="search" size={40} /><h3>No discoveries just yet.</h3><p>Try a different filter, a broader keyword, or explore the whole collection.</p><button className="button button-outline" onClick={reset}>Reset filters <Icon name="arrow" size={17} /></button></div>}
    {!featured && filtered.length > limit && <div className="load-more"><p>Showing {Math.min(limit, filtered.length)} of {filtered.length} products</p><button className="button button-outline" onClick={() => setLimit(previous => previous + 12)}>Discover more <Icon name="plus" size={18} /></button></div>}
  </div>;
}
export function WishlistContent({ products }: { products: Product[] }) {
  const { wishlist, hydrated } = useStore();
  const saved = products.filter(p => wishlist.includes(p.slug));
  if (!hydrated) return <p className="loading-text">Gathering your favorites…</p>;
  return saved.length ? <><p className="saved-count">{saved.length} little reasons to love your reef.</p><div className="product-grid">{saved.map(p => <ProductCard product={p} key={p.slug} />)}</div></> : <div className="empty-state"><Icon name="heart" size={46} /><h3>Your next favorites are out there.</h3><p>Tap the heart on anything you love. We’ll keep it here for your next visit.</p><Link href="/shop" className="button button-teal">Explore the reef <Icon name="arrow" size={18} /></Link></div>;
}
