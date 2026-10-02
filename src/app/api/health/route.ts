import { db, isDatabaseConfigured } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (isDatabaseConfigured) {
      await db.execute(sql`select 1`);
      return Response.json({ ok: true, database: true });
    }
    return Response.json({ ok: true, database: false, mode: "standalone" });
  } catch (err) {
    return Response.json({ ok: true, database: false, note: (err as Error).message });
  }
}
