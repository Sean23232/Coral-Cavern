'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { catalog, money, productIntro, type Product } from '@/lib/catalog';
import { Icon } from './icons';

export type CartLine = { product: Product; quantity: number; variant?: string };
type Panel = 'cart' | 'search' | 'menu' | null;
type Store = {
  cart: CartLine[]; wishlist: string[]; hydrated: boolean; panel: Panel; setPanel: (panel: Panel) => void;
  quickView: Product | null; setQuickView: (p: Product | null) => void;
  add: (p: Product, quantity?: number, variant?: string, open?: boolean) => void;
  update: (slug: string, quantity: number) => void; remove: (slug: string) => void; clear: () => void;
  toggleWish: (slug: string) => void; notify: (message: string) => void; subtotal: number; count: number;
};
const StoreContext = createContext<Store | null>(null);
export function useStore() { const context = useContext(StoreContext); if (!context) throw new Error('Store provider is required'); return context; }
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [toast, setToast] = useState('');
  const pathname = usePathname();
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('coral-cart-v1') || '[]');
      if (Array.isArray(saved)) setCart(saved.filter((i: CartLine) => i?.product?.slug && Number.isInteger(i.quantity) && i.quantity > 0 && i.quantity <= 20));
      const wishes = JSON.parse(localStorage.getItem('coral-wishlist-v1') || '[]');
      if (Array.isArray(wishes)) setWishlist(wishes.filter((s: unknown) => typeof s === 'string'));
    } catch { /* A fresh session is safe when browser storage is unavailable. */ }
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) { try { localStorage.setItem('coral-cart-v1', JSON.stringify(cart)); localStorage.setItem('coral-wishlist-v1', JSON.stringify(wishlist)); } catch { /* Shopping remains available in memory. */ } } }, [cart, wishlist, hydrated]);
  useEffect(() => { setPanel(null); setQuickView(null); }, [pathname]);
  useEffect(() => { if (!toast) return; const timeout = setTimeout(() => setToast(''), 4200); return () => clearTimeout(timeout); }, [toast]);
  const add: Store['add'] = (product, quantity = 1, variant, open = true) => {
    if (!product.available || product.price === null) { setToast('Please ask our team about this specimen’s availability.'); return; }
    setCart(previous => {
      const existing = previous.find(line => line.product.slug === product.slug);
      return existing ? previous.map(line => line.product.slug === product.slug ? { ...line, quantity: Math.min(20, line.quantity + quantity), variant: variant || line.variant } : line) : [...previous, { product, quantity: Math.min(20, quantity), variant }];
    });
    setQuickView(null);
    if (open) setPanel('cart');
    setToast('A little more ocean, added to your bag.');
  };
  const update = (slug: string, quantity: number) => setCart(previous => quantity <= 0 ? previous.filter(i => i.product.slug !== slug) : previous.map(i => i.product.slug === slug ? { ...i, quantity: Math.min(20, quantity) } : i));
  const remove = (slug: string) => { setCart(previous => previous.filter(i => i.product.slug !== slug)); setToast('Item removed from your bag.'); };
  const toggleWish = (slug: string) => { setWishlist(previous => previous.includes(slug) ? previous.filter(i => i !== slug) : [...previous, slug]); setToast(wishlist.includes(slug) ? 'Removed from your saved collection.' : 'Saved to your reef wishlist.'); };
  const subtotal = cart.reduce((total, line) => total + (line.product.variants?.find(v => v.id === line.variant)?.price ?? line.product.price ?? 0) * line.quantity, 0);
  return <StoreContext.Provider value={{ cart, wishlist, hydrated, panel, setPanel, quickView, setQuickView, add, update, remove, clear: () => setCart([]), toggleWish, notify: setToast, subtotal, count: cart.reduce((total, line) => total + line.quantity, 0) }}>
    {children}
    <StoreOverlays />
    {toast && <div className="toast" role="status"><Icon name="check" size={18} /><span>{toast}</span><button aria-label="Dismiss notification" onClick={() => setToast('')}><Icon name="close" size={16} /></button></div>}
  </StoreContext.Provider>;
}
export function Dialog({ children, onClose, title, className = '' }: { children: ReactNode; onClose: () => void; title: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const element = ref.current;
    const timer = setTimeout(() => element?.querySelector<HTMLElement>('[autofocus], input, button, a')?.focus(), 40);
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current();
      if (event.key === 'Tab' && element) {
        const focusables = Array.from(element.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex="0"]')).filter(el => el.offsetParent !== null);
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => { clearTimeout(timer); document.body.style.overflow = overflow; document.removeEventListener('keydown', keydown); before?.focus(); };
  }, []);
  return <div className={`modal-backdrop ${className}`} onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><div ref={ref} role="dialog" aria-modal="true" aria-label={title} className="dialog"><button className="icon-button dialog-close" aria-label={`Close ${title.toLowerCase()}`} onClick={onClose}><Icon name="close" /></button>{children}</div></div>;
}
export function Quantity({ value, onChange, label = 'Quantity' }: { value: number; onChange: (value: number) => void; label?: string }) {
  return <div className="quantity"><button aria-label={`Decrease ${label.toLowerCase()}`} disabled={value <= 1} onClick={() => onChange(value - 1)}><Icon name="minus" size={15} /></button><span aria-label={label}>{value}</span><button aria-label={`Increase ${label.toLowerCase()}`} disabled={value >= 20} onClick={() => onChange(value + 1)}><Icon name="plus" size={15} /></button></div>;
}
export function CartItems() {
  const { cart, update, remove } = useStore();
  return <div className="cart-items">{cart.map(({ product, quantity, variant }) => <div className="cart-item" key={product.slug}>
    <Link href={`/product/${product.slug}`} className="cart-item-image"><img src={product.image} alt={product.name} /></Link>
    <div className="cart-item-info"><span className="mini-label">{product.type}</span><Link href={`/product/${product.slug}`} className="cart-item-name">{product.name}</Link>{variant && <small>{product.variants?.find(v => v.id === variant)?.name}</small>}<strong>{money((product.variants?.find(v => v.id === variant)?.price ?? product.price ?? 0) * quantity)}</strong><div className="cart-item-controls"><Quantity value={quantity} onChange={value => update(product.slug, value)} label={`quantity of ${product.name}`} /><button className="text-button subtle" onClick={() => remove(product.slug)} aria-label={`Remove ${product.name}`}>Remove</button></div></div>
  </div>)}</div>;
}
function SearchPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>(catalog.slice(0, 4));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setPanel } = useStore();
  const router = useRouter();
  useEffect(() => {
    if (!query.trim()) { setResults(catalog.slice(0, 4)); setLoading(false); setError(''); return; }
    const controller = new AbortController();
    setLoading(true); setError('');
    const timer = setTimeout(async () => {
      try { const response = await fetch(`/api/products?q=${encodeURIComponent(query)}`, { signal: controller.signal }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setResults(data.products.slice(0, 6)); }
      catch (e) { if ((e as Error).name !== 'AbortError') setError('Search is temporarily unavailable. Please try again.'); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }, 200);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);
  return <><span className="eyebrow">DISCOVER YOUR NEXT FAVORITE</span><h2>A world to explore.</h2><form className="search-form" onSubmit={event => { event.preventDefault(); setPanel(null); router.push(`/search?q=${encodeURIComponent(query.trim())}`); }}><Icon name="search" /><input autoFocus aria-label="Search products" placeholder="Search corals, marine life, and reef essentials…" value={query} onChange={e => setQuery(e.target.value)} /><button className="icon-button" aria-label="Submit search"><Icon name="arrow" /></button></form><div className="search-popular"><span>Popular searches</span>{['Goniopora', 'Ricordea', 'Inverts'].map(term => <button key={term} onClick={() => setQuery(term)}>{term}</button>)}</div><p className="mini-label search-caption">{loading ? 'Searching the reef…' : query ? `${results.length}${results.length === 6 ? '+' : ''} matching products` : 'FROM OUR COLLECTION'}</p>{error && <p className="form-error" role="alert">{error}</p>}
    {loading ? <div className="empty-state small" role="status"><Icon name="wave" size={30} /><p>Finding your next discovery…</p></div> : error ? null : results.length === 0 ? <div className="empty-state small"><Icon name="search" size={36} /><h3>No discoveries just yet.</h3><p>Try a species name, coral type, or a broader search like “coral”.</p><button className="text-link" onClick={() => setQuery('')}>Explore popular products <Icon name="arrow" size={16} /></button></div> : <div className="search-results">{results.map(p => <Link href={`/product/${p.slug}`} key={p.slug} onClick={() => setPanel(null)}><img src={p.image} alt={p.name} /><div><span className="mini-label">{p.type}</span><h4>{p.name}</h4><span>{money(p.price)}</span></div><Icon name="arrow" size={18} /></Link>)}</div>}
    <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={() => setPanel(null)} className="button button-dark search-all">View all results <Icon name="arrow" size={17} /></Link></>;
}
function StoreOverlays() {
  const { panel, setPanel, quickView, setQuickView, cart, subtotal, count, add, wishlist, toggleWish } = useStore();
  if (quickView) return <Dialog onClose={() => setQuickView(null)} title="Quick view" className="quick-modal"><div className="quick-layout"><img className="quick-image" src={quickView.image} alt={quickView.name} /><div className="quick-info"><span className="eyebrow">{quickView.type}</span><h2>{quickView.name}</h2><p className="product-price">{money(quickView.price)}</p><span className={`availability ${quickView.available ? 'available' : ''}`}><i />{quickView.available ? 'Available in the published catalog' : quickView.inquiry ? 'Availability on request' : 'Currently out of stock'}</span><p>{productIntro(quickView).slice(0, 260)}</p><div className="quick-actions">{quickView.available ? <button className="button button-teal" onClick={() => add(quickView)}>Add to cart <Icon name="bag" size={18} /></button> : <Link className="button button-teal" href={`/contact?subject=${encodeURIComponent('Availability: ' + quickView.name)}`}>Ask about availability <Icon name="arrow" size={18} /></Link>}<button className={`icon-button wish-button ${wishlist.includes(quickView.slug) ? 'is-saved' : ''}`} aria-label="Save to wishlist" onClick={() => toggleWish(quickView.slug)}><Icon name="heart" /></button></div><Link href={`/product/${quickView.slug}`} className="text-link">View full details & care <Icon name="arrow" size={16} /></Link></div></div></Dialog>;
  if (panel === 'search') return <Dialog title="Search" onClose={() => setPanel(null)} className="search-modal"><SearchPanel /></Dialog>;
  if (panel === 'menu') return <Dialog title="Menu" onClose={() => setPanel(null)} className="drawer menu-drawer"><span className="eyebrow">WELCOME TO CORAL CAVERN</span><h2>Find your ocean.</h2><nav className="mobile-links">{[['Corals','/shop/corals'],['Saltwater Fish','/shop/fish'],['Invertebrates','/shop/inverts'],['Aquarium Supplies','/shop/supplies'],['Services','/services'],['Our Story','/about'],['Learn','/learn'],['Contact','/contact']].map(([label, href]) => <Link href={href} key={href} onClick={() => setPanel(null)}>{label}<Icon name="arrow" size={20} /></Link>)}</nav><div className="mobile-account"><Link href="/account"><Icon name="user" size={18} /> My account</Link><Link href="/wishlist"><Icon name="heart" size={18} /> My wishlist</Link></div><p className="mini-label">A LITTLE OCEAN. A LOT OF WONDER.</p></Dialog>;
  if (panel === 'cart') return <Dialog title="Shopping bag" onClose={() => setPanel(null)} className="drawer cart-drawer"><span className="eyebrow">YOUR NEXT CHAPTER</span><h2>Your reef bag <span>({count})</span></h2>{cart.length ? <><div className="cart-notice"><Icon name="wave" size={19} /> Great reefs begin with thoughtful choices.</div><CartItems /><div className="drawer-summary"><div className="summary-line"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Shipping and availability confirmed before fulfillment.</p><Link href="/checkout" className="button button-teal" onClick={() => setPanel(null)}>Proceed to checkout <Icon name="arrow" size={18} /></Link><Link href="/cart" className="text-link center" onClick={() => setPanel(null)}>View shopping bag</Link><span className="checkout-disclaimer"><Icon name="lock" size={13} /> Preview checkout · No payments collected</span></div></> : <div className="empty-state"><Icon name="bag" size={46} /><h3>A little room for wonder.</h3><p>Your bag is empty. Let’s find something extraordinary for your reef.</p><Link href="/shop" className="button button-teal" onClick={() => setPanel(null)}>Explore the collection <Icon name="arrow" size={18} /></Link></div>}</Dialog>;
  return null;
}
