'use client';
import { useState, type FormEvent } from 'react';
import { Icon } from './icons';

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setState('loading'); setMessage('');
    try { const response = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setState('success'); setMessage(data.message); setEmail(''); }
    catch (e) { setState('error'); setMessage((e as Error).message || 'Please try again.'); }
  }
  return <div className={`newsletter-form-wrap ${compact ? 'compact' : ''}`}>{state === 'success' ? <div className="newsletter-success" role="status"><Icon name="check" size={22} /><p>{message}</p></div> : <form onSubmit={submit} className="newsletter-form"><label className="sr-only" htmlFor={compact ? 'footer-email' : 'newsletter-email'}>Your email address</label><input id={compact ? 'footer-email' : 'newsletter-email'} type="email" required maxLength={254} autoComplete="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} /><button type="submit" disabled={state === 'loading'}>{state === 'loading' ? 'Joining…' : 'Subscribe'}<Icon name="arrow" size={18} /></button></form>}{state === 'error' && <p className="form-error" role="alert">{message}</p>}{state !== 'success' && <p className="newsletter-privacy">Just the good stuff. Unsubscribe anytime.</p>}</div>;
}
export function InquiryForm({ kind = 'contact', defaultSubject = '' }: { kind?: 'contact' | 'service'; defaultSubject?: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState('loading'); setMessage('');
    try { const response = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, kind }) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); setState('success'); setMessage(result.message); form.reset(); }
    catch (e) { setState('error'); setMessage((e as Error).message || 'Something went wrong. Please try again.'); }
  }
  if (state === 'success') return <div className="form-success" role="status"><div className="success-icon"><Icon name="check" size={30} /></div><h3>A conversation worth starting.</h3><p>{message}</p><a href="mailto:coralcavern7@gmail.com" className="text-link">Email Coral Cavern <Icon name="arrow" size={16} /></a><button className="text-button" onClick={() => setState('idle')}>Send another inquiry</button></div>;
  return <form className="inquiry-form" onSubmit={submit}><div className="form-grid"><label>Full name <span>*</span><input name="name" autoComplete="name" minLength={2} maxLength={100} required placeholder="Your name" /></label><label>Email address <span>*</span><input type="email" name="email" autoComplete="email" maxLength={254} required placeholder="you@example.com" /></label><label>Phone number<input type="tel" name="phone" autoComplete="tel" maxLength={30} placeholder="Optional" /></label><label>{kind === 'service' ? 'I’m interested in' : 'How can we help?'} <span>*</span><select name="subject" defaultValue={defaultSubject || ''} required><option value="" disabled>Select a topic</option>{defaultSubject && <option value={defaultSubject}>{defaultSubject}</option>}{(kind === 'service' ? ['Aquarium installation', 'Aquarium maintenance', 'Reef tank setup', 'Ongoing aquarium care', 'Design consultation'] : ['Product availability', 'Coral & fish care', 'An existing order', 'Aquarium services', 'Something else']).map(option => <option key={option} value={option}>{option}</option>)}</select></label></div><label>{kind === 'service' ? 'Tell us about your aquarium' : 'Your message'} <span>*</span><textarea name="message" required minLength={10} maxLength={5000} rows={5} placeholder={kind === 'service' ? 'Share your location, aquarium size, and what you have in mind…' : 'We’d love to hear what’s on your mind…'} /></label><label className="checkbox-label"><input type="checkbox" required /><span>I agree to be contacted about this inquiry.</span></label>{state === 'error' && <p className="form-error" role="alert">{message}</p>}<button className="button button-teal" type="submit" disabled={state === 'loading'}>{state === 'loading' ? 'Sending…' : kind === 'service' ? 'Request a consultation' : 'Send your message'}<Icon name="arrow" size={18} /></button><p className="form-footnote">This preview securely saves your inquiry. For a live response, contact us directly.</p></form>;
}
