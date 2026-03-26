import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { buildAuthorizeUrl, PORTAL_NONCE_COOKIE, PORTAL_STATE_COOKIE } from "@/lib/platform-auth";

export async function GET() {
  const state = crypto.randomUUID();
  const nonce = crypto.randomUUID();
  const cookieStore = await cookies();

  const cookieOptions = {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };

  cookieStore.set(PORTAL_STATE_COOKIE, state, cookieOptions);
  cookieStore.set(PORTAL_NONCE_COOKIE, nonce, cookieOptions);

  return NextResponse.redirect(buildAuthorizeUrl(state, nonce));
}
