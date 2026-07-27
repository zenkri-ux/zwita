import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  adminPassword,
  signSession,
} from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function passwordMatches(input: string, expected: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  // timingSafeEqual requires equal lengths; guard first without leaking timing.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const secret = adminPassword();
  if (!secret) {
    return NextResponse.json(
      { error: "admin_not_configured" },
      { status: 503 },
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    if (typeof body.password === "string") password = body.password;
  } catch {
    // fall through to invalid
  }

  if (!password || !passwordMatches(password, secret)) {
    return NextResponse.json({ error: "invalid_password" }, { status: 401 });
  }

  const token = await signSession(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
