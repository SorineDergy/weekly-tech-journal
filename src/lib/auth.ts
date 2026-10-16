import { timingSafeEqual } from "node:crypto";
import { fail, serverError } from "@/lib/api";

export function requireWriteToken(req: Request) {
  const expected = process.env.API_WRITE_TOKEN;
  if (!expected) return serverError(new Error("API_WRITE_TOKEN is not set"));

  const header = req.headers.get("authorization") ?? "";
  const given = header.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(given);
  const b = Buffer.from(expected);

  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return fail(401, "UNAUTHORIZED", "Missing or invalid token");
  }
  return null;
}
