import type { Metadata } from 'next';
import { AccountContent } from '@/components/commerce';
export const metadata: Metadata = { title: 'Your Account', robots: { index: false, follow: false } };
export default function AccountPage() { return <main id="main-content" className="account-page"><div className="container"><AccountContent /></div></main>; }
