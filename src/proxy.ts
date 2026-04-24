import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  checkSessionValid,
  GATEWAY_LOGIN_URL,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

/**
 * Routes that are publicly accessible without an active session.
 * Every other path requires the user to be authenticated.
 */
const PUBLIC_PATHS = new Set(["/"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the home / login page through unconditionally.
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  // ── Fast path ──────────────────────────────────────────────────────────────
  // If there's no session cookie at all, don't bother asking the Gateway —
  // we know the answer. Saves a round-trip on the common unauthenticated case.
  if (!request.cookies.has(SESSION_COOKIE_NAME)) {
    return NextResponse.redirect(GATEWAY_LOGIN_URL);
  }

  // ── Validate with the Gateway ──────────────────────────────────────────────
  const cookieHeader = request.headers.get("cookie") ?? "";

  try {
    const isValid = await checkSessionValid(cookieHeader);
    if (!isValid) {
      return NextResponse.redirect(GATEWAY_LOGIN_URL);
    }
  } catch (error) {
    // Gateway network error / 5xx — fail open.
    // Proxy is not a security boundary; Spring Security still authenticates
    // every API call, so a transient Gateway blip shouldn't lock users out.
    console.warn("[proxy] Auth status check failed; failing open:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run proxy on every route EXCEPT:
     *  - Next.js internals  (_next/static, _next/image)
     *  - The favicon
     *
     * This regex is the standard Next.js negative-lookahead pattern.
     */
    "/((?!_next/static|_next/image|favicon\\.ico).*)",
  ],
};
