import { pgTable, text, integer, boolean, jsonb, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { Product } from '@/lib/catalog';

export const products = pgTable('products', {
  slug: text('slug').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: integer('price'),
  available: boolean('available').notNull().default(false),
  data: jsonb('data').$type<Product>().notNull(),
});
export const subscribers = pgTable('subscribers', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const inquiries = pgTable('inquiries', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  kind: text('kind').notNull().default('contact'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const sessions = pgTable('sessions', {
  token: text('token').primaryKey(),
  customerId: uuid('customer_id').references(() => customers.id, { onDelete: 'cascade' }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});
export type OrderItem = { slug: string; name: string; image: string; price: number; quantity: number; variant?: string };
export type ShippingAddress = { name: string; address: string; city: string; state: string; zip: string; country: string; phone: string; method: string };
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  number: text('number').notNull().unique(),
  customerId: uuid('customer_id').references(() => customers.id),
  email: text('email').notNull(),
  items: jsonb('items').$type<OrderItem[]>().notNull(),
  shipping: jsonb('shipping').$type<ShippingAddress>().notNull(),
  subtotal: integer('subtotal').notNull(),
  status: text('status').notNull().default('preview — no payment collected'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
