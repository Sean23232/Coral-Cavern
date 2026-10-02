import Link from 'next/link';
import { Icon } from '@/components/icons';
export default function NotFound() { return <main id="main-content" className="not-found"><div><Icon name="coral" size={55} /><span className="eyebrow">A LITTLE OFF THE REEF</span><h1>Let’s find your way back.</h1><p>This corner of the ocean doesn’t seem to be here. There’s still a whole world waiting to be discovered.</p><Link href="/shop" className="button button-teal">Explore the collection <Icon name="arrow" size={18} /></Link></div></main>; }
