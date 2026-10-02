'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/icons';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Captured runtime error:', error);
  }, [error]);

  return (
    <main id="main-content" className="not-found">
      <div>
        <Icon name="wave" size={48} />
        <span className="eyebrow">A MOMENT BETWEEN THE WAVES</span>
        <h1>The reef will be right back.</h1>
        <p>We couldn’t load this page just now. Your saved bag is still in this browser. Please try again, or get in touch if you need a hand.</p>
        <div className="button-group" style={{ justifyContent: 'center' }}>
          <button className="button button-teal" onClick={reset}>
            Try again <Icon name="arrow" size={17} />
          </button>
          <Link href="/contact" className="text-link">
            Contact Coral Cavern <Icon name="arrow" size={17} />
          </Link>
        </div>
      </div>
    </main>
  );
}
