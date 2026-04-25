import { cache } from "react";
import { cookies, headers } from "next/headers";
import { getAvatarDataUrl } from "@/lib/avatar";

/**
 * Authentication constants and helpers shared by the proxy and Server Components.
 *
 * The Spring Boot Gateway is configured to issue a session cookie named
 * `RADIUS_SESSION` (see `server.servlet.session.cookie.name` in the gateway's
 * application.yml). The cookie is HttpOnly + SameSite=Lax and is created after
 * a successful Google OAuth2 login at the Gateway (localhost:8080).
 *
 * Keep this value in sync with the Gateway config — this is the single source
 * of truth on the web side.
 */
export const SESSION_COOKIE_NAME = "RADIUS_SESSION";

/**
 * The Gateway URL that kicks off the Google OAuth2 authorization flow.
 * A full browser navigation to this URL is required (not a client-side
 * navigation) so Spring Security can handle the redirect chain end-to-end.
 */
export const GATEWAY_LOGIN_URL =
  "http://localhost:8080/oauth2/authorization/google";

/**
 * The Gateway endpoint used by the proxy to validate an existing session.
 * Expected contract:
 *   - 2xx  → session is valid
 *   - 401  → session is missing / expired / invalid
 *   - 5xx / network error → Gateway issue (callers decide how to react)
 */
export const GATEWAY_AUTH_STATUS_URL =
  "http://localhost:8080/api/auth/status";

/**
 * Asks the Gateway whether the supplied cookie header represents a currently
 * authenticated session.
 *
 * @returns
 *   - `true`  → Gateway confirmed the session is valid (2xx)
 *   - `false` → Gateway definitively rejected (401 / 403, or no cookie)
 *
 * @throws Propagates network errors and 5xx responses. Callers decide whether
 *         to fail-open (proxy) or fall back to a heuristic (home page UI).
 *
 * Forwarding the raw cookie header (rather than rebuilding it from a parsed
 * cookie jar) avoids escaping bugs and ensures the Gateway sees the request
 * exactly as the browser sent it.
 */
export async function checkSessionValid(
  cookieHeader: string
): Promise<boolean> {
  if (!cookieHeader) return false;

  const res = await fetch(GATEWAY_AUTH_STATUS_URL, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) return false;
  if (res.ok) return true;

  // 5xx or other non-2xx → let the caller decide.
  throw new Error(`Auth status returned ${res.status}`);
}

/**
 * Shape returned by the Gateway's `/api/auth/status` endpoint, augmented with
 * a server-resolved avatar.
 *
 * `authenticated` is the authoritative signal; the other identity fields are
 * populated when the session is valid and are empty strings when it is not.
 * Treat any `AuthUser | null` returned by `getCurrentUser()` as the full
 * source of truth for "who is the current viewer" on the server.
 *
 * `avatarDataUrl` is a base64 `data:image/svg+xml` URL produced by
 * `getAvatarDataUrl(username)` on the server (with cross-request caching), so
 * every consumer — Server or Client Component — can render the avatar with
 * zero extra network calls. Falls back to the raw DiceBear URL only if the
 * SVG fetch fails.
 */
export interface AuthUser {
  authenticated: boolean;
  name: string;
  email: string;
  username: string;
  avatarDataUrl: string;
}

/**
 * Request-scoped fetch of the currently authenticated user.
 *
 * Wrapped in React's `cache()` so that every Server Component in the same
 * render pass (layout, page, nested components) shares a single underlying
 * request to the Gateway. Returns `null` when:
 *   - no session cookie is present (fast path, no network call),
 *   - the Gateway responds 401/403,
 *   - the Gateway reports `authenticated: false`,
 *   - the Gateway is unreachable / returns 5xx (we fail closed for display
 *     purposes — the proxy still decides routing).
 *
 * Intended for rendering ("Welcome, {name}") — NOT for authorization gates.
 * Authorization is enforced by the proxy + Spring Security on the Gateway.
 */
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  // Next.js 16: cookies() and headers() are async.
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);

  // Fast path: no session cookie at all → skip the network call.
  if (!cookieStore.has(SESSION_COOKIE_NAME)) return null;

  // Forward the raw cookie header so the Gateway sees the request exactly as
  // the browser sent it (avoids escaping bugs from rebuilding the cookie jar).
  const cookieHeader = headerStore.get("cookie") ?? "";
  if (!cookieHeader) return null;

  try {
    const res = await fetch(GATEWAY_AUTH_STATUS_URL, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    if (!res.ok) return null;

    // The Gateway returns only the identity fields — augment with the avatar
    // here so every consumer reads a single, complete object.
    const data = (await res.json()) as Omit<AuthUser, "avatarDataUrl">;
    if (!data.authenticated) return null;

    const avatarDataUrl = await getAvatarDataUrl(data.username);
    return { ...data, avatarDataUrl };
  } catch (error) {
    // Gateway unreachable → treat as unauthenticated for display. The proxy
    // separately decides whether to redirect to login on the next navigation.
    console.warn("[auth] Failed to fetch current user:", error);
    return null;
  }
});
