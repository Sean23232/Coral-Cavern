import type { CSSProperties } from 'react';
const paths: Record<string, string> = {
  arrow: 'M4 12h15m-6-6 6 6-6 6',
  'arrow-up': 'M6 18 18 6M6 6h12v12',
  chevron: 'm8 4 8 8-8 8',
  down: 'm6 9 6 6 6-6',
  search: 'm21 21-5.2-5.2M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  user: 'M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2M16 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  bag: 'M5 7h14l1 14H4L5 7Zm3 0V5a4 4 0 0 1 8 0v2',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  close: 'm6 6 12 12M6 18 18 6',
  menu: 'M3 6h18M3 12h18M3 18h18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  check: 'm5 12 4 4L19 6',
  trash: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7',
  leaf: 'M20 3C8 1 2 7 4 15s12 9 16-12ZM4 21 15 9',
  wave: 'M2 8c4-6 6 6 10 0s6 6 10 0M2 16c4-6 6 6 10 0s6 6 10 0',
  shield: 'M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4Zm-4 10 3 3 5-6',
  truck: 'M1 4h13v13H1V4Zm13 5h4l4 5v3h-8M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0m12 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  fish: 'M3 12s5-8 12-6l4-3v7l3 2-3 2v7l-4-3c-7 2-12-6-12-6Zm5-1h.01M12 6l-1-3m1 15-1 3',
  sun: 'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
  drop: 'M12 2S4 11 4 15a8 8 0 0 0 16 0c0-4-8-13-8-13Z',
  sparkles: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4',
  chat: 'M21 11a9 9 0 0 1-9 9 9 9 0 0 1-4-1l-6 2 2-6a9 9 0 1 1 17-4ZM7 10h10m-10 4h6',
  mail: 'M3 4h18v16H3V4Zm0 1 9 8 9-8',
  phone: 'M4 3h4l2 5-3 2a15 15 0 0 0 7 7l2-3 5 2v4c-9 4-21-8-17-17Z',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  clock: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 6v6l4 2',
  filter: 'M4 5h16M7 12h10M10 19h4M8 3v4m8 3v4m-4 3v4',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Zm15 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  lock: 'M5 10h14v11H5V10Zm3 0V6a4 4 0 0 1 8 0v4m-4 5v2',
  instagram: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm9 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0m2-6h.01',
  facebook: 'M15 22v-9h3l1-4h-4V6c0-1 1-2 2-2h2V1h-3c-4 0-5 2-5 5v3H8v4h3v9',
  coral: 'M12 22V6M12 15l-6-4V6m6 12 7-5V8M6 8 2 5V2m4 5 3-3V1m3 9 5-4V1m-5 7-2-4m9 7 3-3V5m-3 11 4-2',
};
export function Icon({ name, size = 22, className = '', style }: { name: string; size?: number; className?: string; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} style={style}><path d={paths[name] || paths.sparkles} /></svg>;
}
export function CoralMark({ size = 44 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M24 44V10m0 25L13 26V15m0 7L5 16V9m8 7 5-5V5m6 22 12-9V7m0 8 7-5V5M24 20l5-5V4M24 40l16-10v-9M13 32l-8-5v-6m19-6-5-6"/><path d="M17 44h14" /></svg>;
}
