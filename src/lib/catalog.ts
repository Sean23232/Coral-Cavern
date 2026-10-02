import sourceProducts from './catalog-data.json';

export type Category = 'corals' | 'fish' | 'inverts' | 'supplies';
export type Product = {
  slug: string; name: string; price: number | null; available: boolean;
  category: Category; type: string; image: string; description: string;
  source: string; variants?: { id: string; name: string; price?: number }[];
  inquiry?: boolean;
};
export const money = (cents: number | null) => cents === null ? 'Price on request' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
export const categories = [
  { slug: 'corals', name: 'Corals', short: 'Living color. Endless possibility.', description: 'Discover extraordinary colors, delicate textures, and the quiet movement that makes a reef your own. Explore our collection of LPS and soft corals.', image: '/images/coral-garden.jpg' },
  { slug: 'fish', name: 'Saltwater Fish', short: 'A little personality for your reef.', description: 'From the familiar charm of a clownfish to the graceful movement of a tang, find inspiration for your next aquarium companion. Contact us for current fish availability and pricing.', image: '/images/clownfish.jpg' },
  { slug: 'inverts', name: 'Invertebrates', short: 'Small wonders. Essential balance.', description: 'Meet the fascinating inhabitants that bring another layer of life to a marine aquarium. Explore stars, shrimp, anemones, and reef invertebrates.', image: '/images/anemone.jpg' },
  { slug: 'supplies', name: 'Aquarium Supplies', short: 'Everything a thriving reef needs.', description: 'Thoughtful essentials for a healthy marine environment. Explore fish nutrition and reef care products, or ask our team about equipment for your aquarium.', image: '/images/aquarium.jpg' },
] as const;
const fish: Product[] = [
  { slug: 'clownfish', name: 'Clownfish', price: null, available: false, inquiry: true, category: 'fish', type: 'Reef fish', image: '/images/clownfish.jpg', description: 'Curious, charismatic, and unmistakable. Explore the clownfish collection with our team. Species, size, compatibility, price, and current availability are confirmed individually before purchase.', source: 'https://coralcavern.com/shop/' },
  { slug: 'tangs', name: 'Saltwater Tangs', price: null, available: false, inquiry: true, category: 'fish', type: 'Saltwater fish', image: '/images/reef-tank.jpg', description: 'Graceful swimmers with remarkable color and personality. Tang species have different aquarium size and care requirements. Our team can help you explore suitable options for your established reef.', source: 'https://coralcavern.com/shop/' },
  { slug: 'wrasses', name: 'Wrasses', price: null, available: false, inquiry: true, category: 'fish', type: 'Saltwater fish', image: '/images/reef-hero.jpg', description: 'Bring movement and character to your aquarium. Ask our team about wrasse species, compatibility, tank requirements, pricing, and current availability. Photography is for collection inspiration, not a specific specimen.', source: 'https://coralcavern.com/shop/' },
];
const priority = ['neon-raspberry-blast-ricordea', 'goniopora-purple-tentacles-with-yellow-rim', 'red-mouth-with-yellow-tip-elegance-coral', 'branching-banana-hammer'];
export const catalog: Product[] = [...(sourceProducts as Product[]), ...fish].sort((a, b) => {
  const ai = priority.indexOf(a.slug), bi = priority.indexOf(b.slug);
  return (ai < 0 ? 100 : ai) - (bi < 0 ? 100 : bi);
});
export const findProduct = (slug: string) => catalog.find(p => p.slug === slug);
export function productIntro(product: Product) {
  return product.description.split(/(?:🧼|Care Guide|About Ricordea|About Goniopora)/)[0].replace(/Each specimen is about \[insert size\][^.]*\./g, '').trim().slice(0, 620);
}
export function careDetails(product: Product) {
  if (product.category === 'supplies') return { 'Product type': product.type, 'Use': 'Marine aquariums', 'Size / format': product.name.includes('100g') ? '100g pack' : '10 sheets', 'Storage': 'Store cool and dry', 'Instructions': 'Follow product guidance', 'Advice': 'Ask our aquarium team' };
  if (product.category === 'fish') return { 'Difficulty': 'Species dependent', 'Placement': 'Open swimming space', 'Lighting': 'Species dependent', 'Flow': 'Species dependent', 'Temperament': 'Confirm compatibility', 'Care': 'Discuss your setup with us' };
  const soft = product.type === 'Soft corals';
  const invert = product.category === 'inverts';
  return { 'Difficulty': invert ? 'Species dependent' : 'Intermediate', 'Placement': soft ? 'Low rockwork' : 'Lower reef / sandbed', 'Lighting': invert ? 'Species dependent' : 'Low to moderate', 'Flow': 'Low to moderate', 'Temperament': /hammer|elegance|anemone|torch/.test(product.slug) ? 'Allow space from neighbors' : 'Confirm tank compatibility', 'Care': invert ? 'Stable salinity; slow acclimation' : 'Stable parameters; gentle acclimation' };
}
export const business = { phone: '971-374-4572', email: 'coralcavern7@gmail.com', address: '1341 Ranier Loop NW, Salem, Oregon 97304', hours: 'Monday–Friday, 9am–5pm', instagram: 'https://www.instagram.com/coralcavern777/', facebook: 'https://www.facebook.com/people/Coral-Cavern/100079142182218/' };
