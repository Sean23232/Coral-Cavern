import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/editorial';
import { JournalGrid } from '@/components/journal-grid';
import { Icon } from '@/components/icons';
export const metadata: Metadata = { title: 'The Reef Journal', description: 'Thoughtful guides to reef aquariums, coral care, fish care, water quality, and maintenance.' };
export default function LearnPage() {
  return <main id="main-content" className="learn-page"><div className="container"><Breadcrumbs items={[{ label: 'The reef journal' }]} /><div className="page-heading"><span className="eyebrow">NOTES FROM BELOW THE SURFACE</span><h1>Learn. Build. Thrive.</h1><p>A little knowledge. A deeper connection.<br />Thoughtful guides for every chapter of your reef journey.</p></div><Link href="/learn/your-first-reef" className="journal-feature"><img src="/images/reef-tank.jpg" alt="An underwater aquarium with colorful fish and corals" fetchPriority="high" /><div><span className="eyebrow">THE START OF SOMETHING EXTRAORDINARY</span><h2>Your first reef.<br />A world of possibility.</h2><p>Start with the right questions. Build on a little knowledge.<br />Discover the essentials of a thoughtful saltwater setup.</p><span className="photo-link">Read the guide <Icon name="arrow" size={18} /></span></div></Link><section className="section"><JournalGrid /></section><div className="journal-help"><Icon name="chat" size={30} /><div><h3>Every reef has its own questions.</h3><p>Our guides are a starting point. For advice about your own aquarium, let’s talk.</p></div><Link href="/contact" className="button button-outline">Ask our reef team <Icon name="arrow" size={17} /></Link></div></div></main>;
}
