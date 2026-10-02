import { db, isDatabaseConfigured } from '@/db';
import { products } from '@/db/schema';
import { catalog, findProduct, type Product } from '@/lib/catalog';
import { eq } from 'drizzle-orm';

let seeded = false;

export async function ensureCatalog() {
  if (seeded || !isDatabaseConfigured) return;
  try {
    await db.insert(products).values(catalog.map(p => ({ slug: p.slug, name: p.name, category: p.category, price: p.price, available: p.available, data: p }))).onConflictDoNothing();
    seeded = true;
  } catch (err) {
    console.warn('Database seeding skipped:', (err as Error).message);
  }
}

export async function getProducts(): Promise<Product[]> {
  if (isDatabaseConfigured) {
    try {
      await ensureCatalog();
      const rows = await db.select().from(products);
      if (rows && rows.length > 0) {
        return rows
          .map(r => ({ ...r.data, name: r.name, price: r.price, category: r.category as Product['category'], available: r.available }))
          .sort((a, b) => catalog.findIndex(p => p.slug === a.slug) - catalog.findIndex(p => p.slug === b.slug));
      }
    } catch (err) {
      console.warn('Database query skipped, using static catalog:', (err as Error).message);
    }
  }
  return catalog;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (isDatabaseConfigured) {
    try {
      await ensureCatalog();
      const [row] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
      if (row) {
        return { ...row.data, name: row.name, price: row.price, category: row.category as Product['category'], available: row.available };
      }
    } catch (err) {
      console.warn('Database getProduct skipped, using static catalog:', (err as Error).message);
    }
  }
  return findProduct(slug);
}
