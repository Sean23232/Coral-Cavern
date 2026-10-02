'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CoralMark, Icon } from './icons';
import { useStore } from './store-provider';
import { NewsletterForm } from './forms';
import { business } from '@/lib/catalog';

export function Logo({ light = false }: { light?: boolean }) {
  return <Link className={`brand ${light ? 'brand-light' : ''}`} href="/" aria-label="Coral Cavern home"><span className="brand-mark"><CoralMark /></span><span className="brand-wordmark">CORAL CAVERN<span>MARINE LIFE & REEF CARE</span></span></Link>;
}
const navigation = [['Corals','/shop/corals'],['Fish','/shop/fish'],['Inverts','/shop/inverts'],['Supplies','/shop/supplies'],['Services','/services'],['About','/about'],['Learn','/learn'],['Contact','/contact']];
export function Header() {
  const { setPanel, count, wishlist } = useStore();
  const pathname = usePathname();
  return <><a href="#main-content" className="skip-link">Skip to content</a><div className="announcement"><span>Premium Marine Livestock</span><i /> <span>Quality Reef Products</span><i /><span>Expert Aquarium Care</span></div><header className="site-header"><div className="header-inner"><button className="icon-button mobile-menu-button" aria-label="Open navigation menu" onClick={() => setPanel('menu')}><Icon name="menu" /></button><Logo /><nav className="desktop-nav" aria-label="Main navigation">{navigation.map(([label, href], i) => <Link className={pathname === href ? 'active' : ''} href={href} key={href}>{label}{i < 4 && <Icon name="down" size={11} />}</Link>)}</nav><div className="header-actions"><button className="icon-button" aria-label="Search products" onClick={() => setPanel('search')}><Icon name="search" size={21} /></button><Link href="/account" className="icon-button account-nav" aria-label="Customer account"><Icon name="user" size={21} /></Link><Link href="/wishlist" className="icon-button wishlist-nav" aria-label={`Wishlist, ${wishlist.length} saved items`}><Icon name="heart" size={21} />{wishlist.length > 0 && <span className="small-dot" />}</Link><button className="icon-button bag-button" aria-label={`Open shopping bag, ${count} items`} onClick={() => setPanel('cart')}><Icon name="bag" size={21} /><span className="bag-count">{count}</span></button></div></div></header></>;
}
const footerGroups = [
  { title: 'SHOP', links: [['Corals','/shop/corals'],['Saltwater Fish','/shop/fish'],['Invertebrates','/shop/inverts'],['Supplies & Essentials','/shop/supplies']] },
  { title: 'SERVICES', links: [['Aquarium Installation','/services#installation'],['Aquarium Maintenance','/services#maintenance'],['Reef Consultations','/services#consultation']] },
  { title: 'EXPLORE', links: [['Our Story','/about'],['Contact Us','/contact'],['Frequently Asked Questions','/faq'],['My Account','/account']] },
  { title: 'THE REEF JOURNAL', links: [['Reef Guides','/learn'],['Coral Care','/learn/coral-care'],['Fish Care','/learn/fish-care'],['Water & Maintenance','/learn/water-parameters']] },
];
export function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-top"><div className="footer-brand"><Logo light /><p>A little ocean. A lot of wonder.<br />Marine life, thoughtfully chosen.<br />Reef care, personally guided.</p><div className="social-links"><a href={business.instagram} target="_blank" rel="noreferrer" aria-label="Coral Cavern on Instagram"><Icon name="instagram" size={20} /></a><a href={business.facebook} target="_blank" rel="noreferrer" aria-label="Coral Cavern on Facebook"><Icon name="facebook" size={20} /></a><a href={`mailto:${business.email}`} aria-label="Email Coral Cavern"><Icon name="mail" size={20} /></a></div></div>{footerGroups.map(group => <div className="footer-group" key={group.title}><h3>{group.title}</h3>{group.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>)}</div><div className="footer-middle"><div><span className="eyebrow">LET’S TALK REEF</span><a href={`tel:${business.phone}`}>{business.phone}</a><a href={`mailto:${business.email}`}>{business.email}</a><span className="footer-location">Salem, Oregon · {business.hours}</span></div><div className="footer-newsletter"><h3>A closer connection to the reef.</h3><NewsletterForm compact /></div></div><div className="footer-bottom"><p>© {new Date().getFullYear()} Coral Cavern. All rights reserved.</p><div><Link href="/policies#privacy">Privacy</Link><Link href="/policies#terms">Terms</Link><Link href="/policies#shipping">Shipping & Livestock Care</Link></div><span className="footer-signoff">INSPIRED BY THE OCEAN. MADE FOR YOUR REEF.</span></div></div></footer>;
}
