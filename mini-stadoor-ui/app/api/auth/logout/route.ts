import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { clearPortalSessionCookies } from "@/lib/platform-auth";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  clearPortalSessionCookies(cookieStore);
  return NextResponse.redirect(new URL("/", request.url));
}
