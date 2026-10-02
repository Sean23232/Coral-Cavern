import Link from 'next/link';
import { Icon } from './icons';
import { articles } from '@/lib/articles';

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link>{items.map((item, i) => <span key={i}><Icon name="chevron" size={11} />{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</span>)}</nav>;
}
export function ArticleCard({ article }: { article: typeof articles[number] }) {
  return <article className="article-card"><Link href={`/learn/${article.slug}`} className="article-image"><img src={article.image} alt={article.title} loading="lazy" /><span className="article-arrow"><Icon name="arrow-up" size={23} /></span></Link><div className="article-meta"><span>{article.category}</span><span>{article.minutes} MIN READ</span></div><Link href={`/learn/${article.slug}`}><h3>{article.title}</h3></Link><p>{article.description}</p><Link className="text-link" href={`/learn/${article.slug}`}>Read article <Icon name="arrow" size={15} /></Link></article>;
}
export function TrustFeatures() {
  const features = [
    ['coral', 'Quality Livestock', 'Carefully selected marine life, with the beauty of your reef in mind.'],
    ['chat', 'Real Reef Knowledge', 'Thoughtful guidance from people who share your fascination.'],
    ['sparkles', 'A Curated Selection', 'Remarkable corals, marine life, and the essentials that support them.'],
    ['wave', 'Care Beyond the Sale', 'From the first setup to the everyday rhythm of a healthy aquarium.'],
    ['heart', 'People, Not Just Products', 'A helpful conversation. A considered answer. A partner for your reef.'],
  ];
  return <div className="trust-features">{features.map(([icon,title,body]) => <div className="trust-feature" key={title}><Icon name={icon} size={32} /><h3>{title}</h3><p>{body}</p></div>)}</div>;
}
