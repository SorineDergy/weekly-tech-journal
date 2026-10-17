import { NextResponse } from "next/server";
import { z } from "zod";

type ErrorCode = "VALIDATION_ERROR" | "NOT_FOUND" | "UNAUTHORIZED" | "INTERNAL_ERROR";

export function ok(data: unknown, status = 200, meta?: Record<string, unknown>) {
  return NextResponse.json(meta ? { data, meta } : { data }, { status });
}

export function fail(status: number, code: ErrorCode, message: string, details?: unknown) {
  return NextResponse.json(
    { error: { code, message, ...(details !== undefined ? { details } : {}) } },
    { status },
  );
}

export function validationError(error: z.ZodError) {
  return fail(400, "VALIDATION_ERROR", "Invalid input", z.flattenError(error));
}

export function serverError(error: unknown) {
  console.error(error);
  return fail(500, "INTERNAL_ERROR", "Something went wrong");
}