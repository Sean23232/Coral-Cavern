import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { StoreProvider } from '@/components/store-provider';
import { Header, Footer } from '@/components/site-shell';
import './globals.css';
import './pages.css';

export const metadata: Metadata = {
  title: { default: 'Coral Cavern — Bring the Ocean Home.', template: '%s | Coral Cavern' },
  description: 'Discover extraordinary corals, marine life, thoughtful aquarium essentials, and expert reef care. A little ocean. A lot of wonder.',
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body><StoreProvider><Header />{children}<Footer /></StoreProvider></body></html>;
}
