import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type PortalSession = {
  userUuid: string;
  username: string;
  email?: string;
  displayName?: string;
  accessToken: string;
  idToken?: string;
  expiresAt: number;
};

export const PORTAL_SESSION_COOKIE = "mini_stadoor_portal_session";
export const PORTAL_STATE_COOKIE = "mini_stadoor_portal_state";
export const PORTAL_NONCE_COOKIE = "mini_stadoor_portal_nonce";

export function getPortalAuthConfig() {
  const iamServerBaseUrl = process.env.IAM_SERVER_BASE_URL ?? "http://localhost:9090";
  const portalBaseUrl = process.env.PORTAL_BASE_URL ?? "http://localhost:3000";
  const clientId = process.env.PORTAL_OAUTH_CLIENT_ID ?? "mini-stadoor-portal";
  const clientSecret = process.env.PORTAL_OAUTH_CLIENT_SECRET ?? "mini-stadoor-portal-secret";
  const scope = process.env.PORTAL_OAUTH_SCOPE ?? "openid profile email";

  return {
    iamServerBaseUrl,
    portalBaseUrl,
    clientId,
    clientSecret,
    scope,
    redirectUri: `${portalBaseUrl}/api/auth/callback`,
  };
}

export async function getPortalSession(): Promise<PortalSession | null> {
  const cookieStore = await cookies();
  const rawSession = cookieStore.get(PORTAL_SESSION_COOKIE)?.value;
  if (!rawSession) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(rawSession, "base64url").toString("utf8")) as Partial<PortalSession>;
    if (!parsed.accessToken || !parsed.username || !parsed.expiresAt || parsed.expiresAt <= Date.now()) {
      return null;
    }
    return {
      ...parsed,
      userUuid: parsed.userUuid ?? parsed.username,
    } as PortalSession;
  } catch {
    return null;
  }
}

export async function requirePortalSession() {
  const session = await getPortalSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

export function buildAuthorizeUrl(state: string, nonce: string) {
  const config = getPortalAuthConfig();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    state,
    nonce,
  });

  return `${config.iamServerBaseUrl}/oauth2/authorize?${params.toString()}`;
}

export function createPortalSession(tokenResponse: {
  access_token: string;
  expires_in?: number;
  id_token?: string;
}) {
  const claims = decodeJwtPayload(tokenResponse.id_token ?? tokenResponse.access_token);
  const expiresIn = (tokenResponse.expires_in ?? 3600) * 1000;
  const displayName = resolveDisplayName(claims);

  return {
    userUuid: readClaim(claims, "sub") ?? readClaim(claims, "username") ?? "developer",
    username: readClaim(claims, "username") ?? readClaim(claims, "sub") ?? "developer",
    email: readClaim(claims, "email") ?? undefined,
    displayName,
    accessToken: tokenResponse.access_token,
    idToken: tokenResponse.id_token,
    expiresAt: Date.now() + expiresIn,
  } satisfies PortalSession;
}

export function encodePortalSession(session: PortalSession) {
  return Buffer.from(JSON.stringify(session)).toString("base64url");
}

export function clearPortalSessionCookies(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const cleared = {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };

  cookieStore.set(PORTAL_SESSION_COOKIE, "", cleared);
  cookieStore.set(PORTAL_STATE_COOKIE, "", cleared);
  cookieStore.set(PORTAL_NONCE_COOKIE, "", cleared);
}

function decodeJwtPayload(token: string) {
  const parts = token.split(".");
  if (parts.length < 2) {
    return {} as Record<string, unknown>;
  }

  try {
    return JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as Record<string, unknown>;
  } catch {
    return {} as Record<string, unknown>;
  }
}

function resolveDisplayName(claims: Record<string, unknown>) {
  const fullName = readClaim(claims, "full_name") ?? readClaim(claims, "name");
  if (fullName) {
    return fullName;
  }

  const givenName = readClaim(claims, "given_name");
  const familyName = readClaim(claims, "family_name");
  return [givenName, familyName].filter(Boolean).join(" ") || undefined;
}

function readClaim(claims: Record<string, unknown>, key: string) {
  const value = claims[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}
