import { eq } from "drizzle-orm";
import { db } from "@/db";
import { entries } from "@/db/schema";
import { idSchema, updateEntrySchema } from "@/lib/validation";
import { fail, ok, serverError, validationError } from "@/lib/api";
import { requireWriteToken } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const id = idSchema.safeParse((await params).id);
    if (!id.success) return validationError(id.error);

    const [row] = await db.select().from(entries).where(eq(entries.id, id.data));
    if (!row) return fail(404, "NOT_FOUND", "Entry not found");

    return ok(row);
  } catch (e) {
    return serverError(e);
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const denied = requireWriteToken(req);
    if (denied) return denied;
    const id = idSchema.safeParse((await params).id);
    if (!id.success) return validationError(id.error);

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return fail(400, "VALIDATION_ERROR", "Request body must be valid JSON");
    }

    const parsed = updateEntrySchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const [row] = await db
      .update(entries)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(entries.id, id.data))
      .returning();
    if (!row) return fail(404, "NOT_FOUND", "Entry not found");

    return ok(row);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  try {
    const denied = requireWriteToken(req);
    if (denied) return denied;
    const id = idSchema.safeParse((await params).id);
    if (!id.success) return validationError(id.error);

    const [row] = await db
      .delete(entries)
      .where(eq(entries.id, id.data))
      .returning({ id: entries.id });
    if (!row) return fail(404, "NOT_FOUND", "Entry not found");

    return ok({ id: row.id });
  } catch (e) {
    return serverError(e);
  }
}