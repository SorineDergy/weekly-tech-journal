import { desc } from "drizzle-orm";
import { db } from "@/db";
import { entries } from "@/db/schema";
import { createEntrySchema, listQuerySchema } from "@/lib/validation";
import { fail, ok, serverError, validationError } from "@/lib/api";
import { requireWriteToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const query = Object.fromEntries(new URL(req.url).searchParams);
    const parsed = listQuerySchema.safeParse(query);
    if (!parsed.success) return validationError(parsed.error);

    const { limit, offset } = parsed.data;
    const rows = await db
      .select()
      .from(entries)
      .orderBy(desc(entries.createdAt))
      .limit(limit)
      .offset(offset);

    return ok(rows, 200, { limit, offset });
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: Request) {
  try {
    const denied = requireWriteToken(req);
    if (denied) return denied;
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return fail(400, "VALIDATION_ERROR", "Request body must be valid JSON");
    }

    const parsed = createEntrySchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const [row] = await db.insert(entries).values(parsed.data).returning();
    return ok(row, 201);
  } catch (e) {
    return serverError(e);
  }
}