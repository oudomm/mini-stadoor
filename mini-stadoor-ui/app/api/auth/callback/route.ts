import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  clearPortalSessionCookies,
  createPortalSession,
  encodePortalSession,
  getPortalAuthConfig,
  PORTAL_NONCE_COOKIE,
  PORTAL_SESSION_COOKIE,
  PORTAL_STATE_COOKIE,
} from "@/lib/platform-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const cookieStore = await cookies();

  if (error) {
    clearPortalSessionCookies(cookieStore);
    return NextResponse.redirect(new URL("/login?error=iam_denied", request.url));
  }

  const expectedState = cookieStore.get(PORTAL_STATE_COOKIE)?.value;
  const expectedNonce = cookieStore.get(PORTAL_NONCE_COOKIE)?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    clearPortalSessionCookies(cookieStore);
    return NextResponse.redirect(new URL("/login?error=invalid_state", request.url));
  }

  const config = getPortalAuthConfig();
  const basicAuth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");

  const tokenResponse = await fetch(`${config.iamServerBaseUrl}/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: config.redirectUri,
    }),
    cache: "no-store",
  });

  if (!tokenResponse.ok) {
    clearPortalSessionCookies(cookieStore);
    return NextResponse.redirect(new URL("/login?error=token_exchange_failed", request.url));
  }

  const tokenPayload = (await tokenResponse.json()) as {
    access_token: string;
    expires_in?: number;
    id_token?: string;
  };

  const session = createPortalSession(tokenPayload);
  const nonceFromToken = session.idToken
    ? JSON.parse(Buffer.from(session.idToken.split(".")[1], "base64url").toString("utf8")).nonce
    : undefined;

  if (expectedNonce && nonceFromToken && nonceFromToken !== expectedNonce) {
    clearPortalSessionCookies(cookieStore);
    return NextResponse.redirect(new URL("/login?error=invalid_nonce", request.url));
  }

  clearPortalSessionCookies(cookieStore);
  cookieStore.set(PORTAL_SESSION_COOKIE, encodePortalSession(session), {
    httpOnly: true,
    maxAge: Math.max(60, Math.floor((session.expiresAt - Date.now()) / 1000)),
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
