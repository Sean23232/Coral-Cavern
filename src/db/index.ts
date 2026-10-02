import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/app_db";
export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    // Keep connection timeouts short so failing external connections don't hang serverless functions
    connectionTimeoutMillis: 3000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
