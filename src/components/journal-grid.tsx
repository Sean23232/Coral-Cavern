'use client';
import { useState } from 'react';
import { articles } from '@/lib/articles';
import { ArticleCard } from './editorial';
export function JournalGrid() {
  const [filter, setFilter] = useState('All guides');
  const options = ['All guides', 'Getting started', 'Coral care', 'Fish care', 'Reef essentials', 'Maintenance', 'Aquarium setup'];
  const visible = articles.filter(a => filter === 'All guides' || a.category.toLowerCase() === filter.toLowerCase());
  return <><div className="journal-filters" aria-label="Filter reef guides">{options.map(option => <button className={option === filter ? 'active' : ''} key={option} onClick={() => setFilter(option)}>{option}</button>)}</div><div className="article-grid journal-grid">{visible.map(article => <ArticleCard article={article} key={article.slug} />)}</div></>;
}
